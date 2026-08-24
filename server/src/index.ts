import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import markasRoutes from './routes/markas';
import unitsRoutes from './routes/units';
import membersRoutes from './routes/members';
import relawanRoutes from './routes/relawan';
import bencanaRoutes from './routes/bencana';
import rosterRoutes from './routes/roster';
import kegiatanRoutes from './routes/kegiatan';
import syncRoutes from './routes/sync';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/markas-pmi', markasRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/relawan', relawanRoutes);
app.use('/api/bencana', bencanaRoutes);
app.use('/api/roster', rosterRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Volunteers PMI Kota Cilegon API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
