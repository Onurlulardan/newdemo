import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: 'Yalnızca POST isteği yapılabilir.' });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        active: false,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Kayıt olurken hata:', error);
    res.status(500).json({ message: 'Kayıt olurken bir hata oluştu.' });
  }
}
