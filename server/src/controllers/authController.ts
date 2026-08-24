import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const loginSchema = z.object({
  login: z.string().email(),
  password: z.string().min(6),
  captcha: z.string().min(1),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password, captcha } = loginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: { email: login },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0]?.message || 'Data tidak valid' });
    }
    res.status(400).json({ message: 'Data tidak valid' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logout berhasil' });
};

export const refresh = async (req: Request, res: Response) => {
  // Refresh token logic here
  res.json({ message: 'Token refreshed' });
};
