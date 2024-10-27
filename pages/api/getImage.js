import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { fileName } = req.query;

    const filePath = path.join(process.cwd(), fileName);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'image/jpeg');
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        res.status(404).json({ message: 'Resim bulunamadı' });
    }
}
