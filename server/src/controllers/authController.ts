import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fish-key-12345';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail, mode: 'insensitive' } },
          { username: { equals: cleanUsername, mode: 'insensitive' } },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === cleanEmail.toLowerCase()) {
        return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ' });
      }
      return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        fish: {
          create: {
            name: 'Bob',
            level: 1,
            experience: 0,
            stage: 'egg'
          }
        }
      },
      include: { fish: true }
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ userId: user.id, token, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, identifier, password } = req.body;
    const searchId = (email || username || identifier || '').trim();

    if (!searchId || !password) {
      return res.status(400).json({ error: 'กรุณากรอกอีเมลหรือชื่อผู้ใช้ และรหัสผ่าน' });
    }

    const user = await prisma.user.findFirst({ 
      where: {
        OR: [
          { email: { equals: searchId, mode: 'insensitive' } },
          { username: { equals: searchId, mode: 'insensitive' } },
        ],
      },
      include: { fish: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง (Invalid credentials)' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ userId: user.id, token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
  }
};
