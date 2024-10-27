import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

export const uploadBase64ToUploads = async (base64Data) => {
    const match = base64Data.match(/^data:(\w+\/[\w-]+);base64,/);
    if (!match) {
        throw new Error('Geçersiz base64 formatı');
    }

    const mimeType = match[1];
    const supportedTypes = ['image', 'pdf', 'msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'plain', 'vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const typeCategory = mimeType.split('/')[0];
    const extMap = {
        'jpeg': 'jpg',
        'plain': 'txt',
        'vnd.ms-excel': 'xls',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    };
    const ext = mimeType.split('/')[1];
    const fileExt = extMap[ext] || ext;

    if (!supportedTypes.includes(mimeType.split('/')[1]) && !supportedTypes.includes(typeCategory)) {
        throw new Error('Desteklenmeyen dosya türü');
    }

    const buffer = Buffer.from(base64Data.replace(/^data:\w+\/[\w-]+;base64,/, ''), 'base64');
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir);
    }

    const filePath = path.join(uploadsDir, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    return `/uploads/${uniqueFileName}`;
};


export const deleteAssociatedFiles = async (record) => {
    const uploadDirectory = '/uploads';

    Object.keys(record).forEach(async (key) => {
        const value = record[key];

        if (typeof value === 'string' && value.startsWith(uploadDirectory)) {
            const files = value.split(',');
            await Promise.all(files.map(async (filePath) => {
                const fullFilePath = path.join(process.cwd(), filePath);
                try {
                    if (fs.existsSync(fullFilePath)) {
                        await fs.promises.unlink(fullFilePath);
                        console.log(`${filePath} dosyası başarıyla silindi.`);
                    }
                } catch (error) {
                    console.error(`${filePath} dosyasını silerken hata oluştu:`, error);
                }
            }));
        }
    });
};