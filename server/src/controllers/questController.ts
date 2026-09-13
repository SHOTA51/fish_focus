import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getQuests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    const allQuests = await prisma.quest.findMany();
    
    const userQuests = allQuests.map(q => ({
      ...q,
      currentMinutes: Math.min(user.totalFocusTime, q.goalMinutes),
      isCompleted: user.totalFocusTime >= q.goalMinutes
    }));

    res.json(userQuests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quests' });
  }
};
