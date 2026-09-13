import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const timezone = 'Asia/Bangkok';

    // Helper to get YYYY-MM-DD in a specific timezone
    const formatToBangkokDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    };

    // Helper to get numeric day of week (0=Sun, 1=Mon, ...) in Bangkok timezone
    const getBangkokDayOfWeek = (date: Date) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
      });
      const dayName = formatter.format(date);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days.indexOf(dayName);
    };

    // 1. Fetch User and Fish data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { fish: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Count total successful sessions
    const sessionsCount = await prisma.focusSession.count({
      where: {
        userId,
        success: true
      }
    });

    // 3. Calculate Weekly Activity (Monday to Sunday)
    const now = new Date();
    
    // Determine current Bangkok calendar date and weekday
    const bangkokNowDay = getBangkokDayOfWeek(now);
    const diffToMonday = bangkokNowDay === 0 ? 6 : bangkokNowDay - 1;
    
    // Calculate Monday's date in Bangkok without server-local shifts
    // We move the UTC time by the calculated difference of days
    const mondayDate = new Date(now);
    mondayDate.setUTCDate(mondayDate.getUTCDate() - diffToMonday);
    
    // To be precise for "Monday 00:00 Bangkok", we create an ISO string
    // that represents Monday 00:00 in Asia/Bangkok
    const bangkokMondayDateStr = formatToBangkokDate(mondayDate);
    const mondayStartUTC = new Date(`${bangkokMondayDateStr}T00:00:00+07:00`);
    const nextMondayStartUTC = new Date(mondayStartUTC);
    nextMondayStartUTC.setUTCDate(nextMondayStartUTC.getUTCDate() + 7);

    const weeklySessions = await prisma.focusSession.findMany({
      where: {
        userId,
        success: true,
        timestamp: {
          gte: mondayStartUTC,
          lt: nextMondayStartUTC
        }
      }
    });

    const weeklyData = {
      'M': 0, 'T': 0, 'W': 0, 'T2': 0, 'F': 0, 'S': 0, 'S2': 0
    };
    const dayMap: Record<number, keyof typeof weeklyData> = {
      1: 'M', 2: 'T', 3: 'W', 4: 'T2', 5: 'F', 6: 'S', 0: 'S2'
    };

    weeklySessions.forEach(session => {
      const day = getBangkokDayOfWeek(session.timestamp);
      const key = dayMap[day];
      weeklyData[key] += session.duration;
    });

    const weeklyActivity = [
      { day: 'M', minutes: weeklyData['M'] },
      { day: 'T', minutes: weeklyData['T'] },
      { day: 'W', minutes: weeklyData['W'] },
      { day: 'T', minutes: weeklyData['T2'] },
      { day: 'F', minutes: weeklyData['F'] },
      { day: 'S', minutes: weeklyData['S'] },
      { day: 'S', minutes: weeklyData['S2'] },
    ];

    // 4. Calculate Focus Streak
    const sessionDates = await prisma.focusSession.findMany({
      where: { userId, success: true },
      select: { timestamp: true },
      orderBy: { timestamp: 'desc' }
    });

    const dateSet = new Set(
      sessionDates.map(s => formatToBangkokDate(s.timestamp))
    );

    let streak = 0;
    const todayStr = formatToBangkokDate(now);
    
    // Calculate yesterday's date in Bangkok
    const yesterdayDate = new Date(now);
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterdayStr = formatToBangkokDate(yesterdayDate);

    if (!dateSet.has(todayStr) && !dateSet.has(yesterdayStr)) {
      streak = 0;
    } else {
      let currentCheckDate = dateSet.has(todayStr) ? new Date(now) : new Date(yesterdayDate);
      
      while (true) {
        const dateStr = formatToBangkokDate(currentCheckDate);
        if (dateSet.has(dateStr)) {
          streak++;
          currentCheckDate.setUTCDate(currentCheckDate.getUTCDate() - 1);
        } else {
          break;
        }
      }
    }

    res.json({
      totalFocusTime: user.totalFocusTime,
      sessions: sessionsCount,
      fishLevel: user.fish?.level || 1,
      focusStreak: streak,
      weeklyActivity
    });
  } catch (error) {
    console.error('Statistics Error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};
