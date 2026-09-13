import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import focusRoutes from './routes/focusRoutes';
import questRoutes from './routes/questRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/focus', focusRoutes);
app.use('/api/quests', questRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Focus Fish Server is healthy' });
});

app.listen(PORT, () => {
  console.log(`🚀 Focus Fish Server running on http://localhost:${PORT}`);
});
