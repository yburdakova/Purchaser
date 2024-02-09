import type { VercelRequest, VercelResponse } from '@vercel/node';
import CryptoJS from 'crypto-js';
import { connectToDatabase } from '../../utils/db';
import { User } from '../models/User.ts';
import { verifyTokenAndAdmin } from '../../utils/verifyToken';
import { UserData } from '../../src/data/types.ts';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'PUT') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query as { id: string };
  const bodyData = req.body as UserData;
  const { password: passwordFromBody, contacts } = bodyData;

  await connectToDatabase();

  const adminCheckResult = await verifyTokenAndAdmin(req);
  if (!adminCheckResult.success) {
    res.status(adminCheckResult.status!).json({ message: adminCheckResult.message! });
    return;
  }

  const updateQuery: Omit<UserData, 'password'> & { password?: string } = { ...bodyData, password: undefined };
  if (passwordFromBody) {
    updateQuery.password = CryptoJS.AES.encrypt(passwordFromBody, process.env.PASSWORD_SECRET!).toString();
  }

  try {
    const updateOptions = contacts ? { $set: updateQuery, $push: { contacts: { $each: contacts } } } : { $set: updateQuery };
    const updatedUser = await User.findByIdAndUpdate(id, updateOptions, { new: true }).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json(error);
  }
};