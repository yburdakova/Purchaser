import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../../utils/db';
import { User } from '../../models/User.ts';
import { verifyTokenAndAdmin } from '../../../utils/verifyToken';

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  if (req.method !== 'PATCH') {
    res.status(405).send(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query as { id: string };
  const isActive = req.body.isActive as boolean;

  await connectToDatabase();

  const adminCheckResult = await verifyTokenAndAdmin(req);
  if (!adminCheckResult.success) {
    res.status(adminCheckResult.status!).json({ message: adminCheckResult.message! });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isActive } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json(error);
  }
};
