import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: { fish: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const syncFish = async (req: AuthRequest, res: Response) => {
  try {
    const { level, experience, stage, name } = req.body;
    const userId = req.userId!;

    const currentFish = await prisma.fish.findUnique({ where: { userId } });
    if (!currentFish) return res.status(404).json({ error: 'Fish not found' });

    // Never downgrade level
    const newLevel = Math.max(currentFish.level, level || 1);
    let newStage = stage || currentFish.stage;
    if (newLevel >= 12) newStage = 'adult';
    else if (newLevel >= 6 && (newStage === 'fry' || newStage === 'egg')) newStage = 'juvenile';
    else if (newLevel >= 2 && newStage === 'egg') newStage = 'fry';

    const updatedFish = await prisma.fish.update({
      where: { userId },
      data: {
        level: newLevel,
        experience: experience !== undefined ? experience : currentFish.experience,
        stage: newStage,
        ...(name ? { name } : {}),
      }
    });

    res.json({ fish: updatedFish });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync fish' });
  }
};
