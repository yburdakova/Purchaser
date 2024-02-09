import type { VercelRequest, VercelResponse } from '@vercel/node';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/db';
import { User } from '../models/User.ts'; 

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  await connectToDatabase();

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send("Wrong User Name");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET!).toString(CryptoJS.enc.Utf8);

    if (hashedPassword !== password) {
      res.status(401).send("Wrong Password");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3d" }
    );

    const userWithoutPassword = { ...user.toObject(), password: undefined };
    res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
};
