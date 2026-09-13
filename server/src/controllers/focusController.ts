import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { duration } = req.body;
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { fish: true }
    });

    if (!user || !user.fish) return res.status(404).json({ error: 'User or fish not found' });

    // 1. Update total focus time
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { totalFocusTime: { increment: duration } }
    });

    // 2. Update Fish Experience
    let { level, experience, stage } = user.fish;
    experience += duration;

    const nextLevelExp = level * 100;
    if (experience >= nextLevelExp) {
      level += 1;
      experience -= nextLevelExp;
      
      if (level >= 10) stage = 'adult';
      else if (level >= 5) stage = 'juvenile';
      else if (level >= 2) stage = 'fry';
    }

    const updatedFish = await prisma.fish.update({
      where: { id: user.fish.id },
      data: { level, experience, stage }
    });

    // 3. Record session
    await prisma.focusSession.create({
      data: {
        userId,
        duration,
        success: true
      }
    });

    res.json({ user: updatedUser, fish: updatedFish });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete session' });
  }
};
