# Smart Volunteers PMI Kota Cilegon

Sistem Informasi Manajemen Relawan PMI Kota Cilegon.

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS v3
- Framer Motion
- React Router v6
- TanStack Query
- Recharts
- Lucide React
- React Hook Form + Zod

### Backend
- Node.js + TypeScript + Express
- Prisma ORM + SQLite
- JWT + bcrypt
- Zod validation

## Prerequisites

- Node.js >= 18
- npm >= 9
- Git

## Setup Lokal

### 1. Clone repository
```bash
git clone <repository-url>
cd smart-volunteers-pmi-kota-cilegon
```

### 2. Setup Backend
```bash
cd server
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Backend berjalan di `http://localhost:3000`.

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Build Production

### Frontend
```bash
cd client
npm run build
```

Output folder: `client/dist`

### Backend
```bash
cd server
npm run build
npm start
```

## Deployment

### Frontend (Vercel / Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL` pointing to backend URL

### Backend (Render / Railway)
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm start`
- Environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `NODE_ENV=production`

Referensi file konfigurasi deployment:
- `client/vercel.json`
- `server/render.yaml`

## Environment Variables

### Backend (`server/.env`)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=change-me-to-a-strong-secret
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SHEETS_SPREADSHEET_ID=
```

## Scripts

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Lint check
```

### Backend
```bash
npm run dev              # Development with tsx
npm run build            # TypeScript compile
npm start                # Start production server
npx prisma db push       # Sync schema to database
npm run db:seed          # Seed database
npx prisma studio        # Open Prisma Studio
```

## Troubleshooting

### Port sudah digunakan
- Frontend default: `5173`
- Backend default: `3000`
- Ubah di `client/vite.config.ts` atau `server/.env`

### Database terkunci
- Tutup proses lain yang menggunakan `dev.db`
- Atau hapus file `server/prisma/dev.db` dan jalankan `npx prisma db push` lagi

### Build backend error pada JWT
- Sudah diperbaiki dengan casting `expiresIn` di `authController.ts`

## Kontak

- Developer: Fadil Advertising
- Website: https://fadil-labs.vercel.app/
