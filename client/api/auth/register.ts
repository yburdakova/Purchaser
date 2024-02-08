// api/auth/register.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../utils/db';
import { User }from '../../models/User.ts'; // Убедитесь, что путь к модели корректный
import CryptoJS from 'crypto-js';
import { RegisterRequestBody } from '../../types'; // Предполагается, что этот файл содержит определение типа

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  await connectToDatabase();

  const { title, email, contacts, password }: RegisterRequestBody = req.body;
  const hashedPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET!).toString();

  try {
    const newUser = new User({ title, email, contacts, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};
