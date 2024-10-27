import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { fileName } = req.query;
    console.log(fileName)
    const filePath = path.join(process.cwd(), fileName);

    if (fs.existsSync(filePath)) {
        const contentType = getMimeType(fileName);

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
            res.end();
        });
    } else {
        res.status(404).json({ message: 'Dosya bulunamadı' });
    }
}

const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'bmp': 'image/bmp',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return mimeTypes[extension] || 'application/octet-stream';
};
