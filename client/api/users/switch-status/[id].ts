// Файл /api/users/switch-status/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../../utils/db.ts';
import { User } from '../../models/User.ts';
import { verifyTokenAndAdmin } from '../../middleware/verifyToken.js';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'PATCH') {
    return res.status(405).send(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { isActive } = req.body;

  await connectToDatabase();

  const adminCheck = await verifyTokenAndAdmin(req);
  if (!adminCheck.success) {
    return res.status(adminCheck.status).json(adminCheck.message);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      $set: { isActive },
    }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json(error);
  }
};
