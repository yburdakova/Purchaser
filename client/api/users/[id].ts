// Файл /api/users/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../utils/db';
import { User } from '../models/User';
import CryptoJS from 'crypto-js';
import { verifyTokenAndAdmin } from '../../utils/verifyToken';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'PUT') {
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query; 
  let { password, contacts, ...update } = req.body;

  if (password) {
    password = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET).toString();
  }

  await connectToDatabase();

  const adminCheck = await verifyTokenAndAdmin(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status).json(adminCheck.message);
  }

  try {
    if (contacts) {
      await User.findByIdAndUpdate(id, {
        $set: { ...update, password },
        $push: { contacts: { $each: contacts } }
      }, { new: true });
    } else {
      await User.findByIdAndUpdate(id, {
        $set: { ...update, password }
      }, { new: true });
    }

    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json(error);
  }
};
