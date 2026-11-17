import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const { duration, earnedExp: clientExp, clientLevel, clientStage } = req.body;
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

    // 2. Update Fish Experience (Honor client progress if higher, e.g. from feeding food or offline)
    let { level, experience, stage } = user.fish;
    if (clientLevel && clientLevel > level) {
      level = clientLevel;
      stage = clientStage || stage;
    }

    const earnedExp = clientExp !== undefined ? clientExp : (duration * 2);
    experience += earnedExp;

    let targetExp = level <= 1 ? 50 : level * 75;
    while (experience >= targetExp) {
      level += 1;
      experience -= targetExp;

      // Pokemon evolution thresholds
      if (level >= 12) stage = 'adult';
      else if (level >= 6) stage = 'juvenile';
      else if (level >= 2) stage = 'fry';

      targetExp = level * 75;
    }

    // Strictly ensure stage cannot be lower than level threshold
    if (level >= 12) stage = 'adult';
    else if (level >= 6 && (stage === 'egg' || stage === 'fry')) stage = 'juvenile';
    else if (level >= 2 && stage === 'egg') stage = 'fry';

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
