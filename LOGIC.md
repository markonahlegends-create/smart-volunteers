# Smart Volunteers PMI Kota Cilegon
## Logic & Architecture Documentation

---

## 1. Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **CORS**: cors middleware
- **Google Integration**: Google APIs (Sheets, Docs, Drive)

---

## 2. Database Strategy

### Primary Database: SQLite
- **Why**: 100% free, unlimited storage, open source, no server required
- **File**: `smart-volunteers.db` stored locally
- **Backup**: Auto-sync to Google Drive as `.db` file and `.sql` dump

### Google Workspace Integration
All data is also synced to Google ecosystem for backup, reporting, and sharing:

#### Google Sheets (Data Export)
- Master spreadsheet for each data type:
  - `Anggota PMR` sheet
  - `Anggota KSR` sheet
  - `Anggota TSR` sheet
  - `Unit PMR` sheet
  - `Kejadian Bencana` sheet
  - `Roster` sheet
- Auto-sync: Daily or on-demand
- Manual export button for instant sharing

#### Google Docs (Document Generation)
- Templates for:
  - Surat keterangan anggota
  - Laporan kegiatan
  - Surat tugas
- Merge data from database into templates
- Generate PDF via Google Docs export

#### Google Drive (File Storage)
- Backup folder: `Smart Volunteers PMI Kota Cilegon/Backups/`
- Database backups: Daily `.db` and `.sql` files
- Documents folder: Generated reports and letters
- Photos folder: Member photos (if needed)

---

## 3. Database Schema

### Users (Admin/Staff)
```
id, email, password_hash, nama, role, created_at, updated_at
```

### MarkasPMI
```
id, nama_pmi, level_pmi, nama_kepala_markas, no_telpon, email, kode_pos, alamat, created_at, updated_at
```

### Provinces & Regencies (static data from Indonesia)

### UnitPMR
```
id, id_provinsi, id_kabupaten, nama_unit, alamat, email, no_telpon, status, tingkat (MULA/MADYA/WIRA), created_at, updated_at
```

### UnitKSR
```
id, id_provinsi, id_kabupaten, nama_unit, alamat, email, no_telpon, status, jenis (MARKAS/PERGURUAN_TINGGI), created_at, updated_at
```

### UnitTSR
```
id, id_provinsi, id_kabupaten, nama_unit, alamat, email, no_telpon, status, jenis (KAB_KOTA), created_at, updated_at
```

### AnggotaPMR
```
id, domisili_id_provinsi, domisili_id_kabupaten, angkatan, kode_anggota, nama, kelamin, status, id_unit, nama_pmi, nama_unit, jenis, created_at, updated_at
```

### AnggotaKSR
```
id, domisili_id_provinsi, domisili_id_kabupaten, angkatan, kode_anggota, nama, kelamin, status, id_unit, nama_pmi, nama_unit, jenis, created_at, updated_at
```

### AnggotaTSR
```
id, domisili_id_provinsi, domisili_id_kabupaten, angkatan, kode_anggota, nama, kelamin, status, id_unit, nama_pmi, nama_unit, jenis, created_at, updated_at
```

### Bencana
```
id, jenis_bencana, nama_kejadian, tanggal_kejadian, id_provinsi, level, status, created_at, updated_at
```

### Roster
```
id, kode_anggota, nama, unit, jenis, created_at
```

### Captcha
```
id, code, created_at
```

### GoogleSync (Sync Log)
```
id, service (sheets/docs/drive), action, status, file_id, created_at
```

---

## 4. Feature Modules (Kota Cilegon Focused)

### A. Authentication
- Login with email/password
- CAPTCHA verification (image + refresh)
- Session management (JWT)
- Password reset request
- Logout

### B. Dashboard
- Animated statistics cards (PMR, KSR, TSR counts for Kota Cilegon)
- Charts: Member distribution by unit, disaster timeline
- Recent disaster incidents in Banten/Kota Cilegon
- Quick access buttons
- Responsive grid layout

### C. Markas PMI
- Single record: PMI Kota Cilegon
- View/Edit organization data
- Contact information

### D. Unit Management (Kota Cilegon Only)
#### PMR Units
- Mula (SD level) - 7 units
- Madya (SMP level) - 35 units
- Wira (SMA/SMK level) - 30 units
- Each with view/edit capability

#### KSR Units
- Markas: KSR PMI Kota Cilegon
- Perguruan Tinggi: Universities in Cilegon

#### TSR Units
- TSR PMI Kota Cilegon

### E. Member Management
- List all members with pagination
- Filter by unit, status, angkatan
- View member detail
- Add/Edit member
- Status management (Aktif/Tidak Aktif/Suspend)
- Member card export to Google Docs
- Search by kode anggota or nama

### F. Disaster Management
- List disasters in Banten/Kota Cilegon
- Create/Edit disaster records
- Status tracking (Kejadian/Tanggap darurat/Pemulihan/Peringatan dini/Selesai)
- Export laporan to Google Sheets/Docs

### G. Roster Registration
- Input kode anggota to register for roster
- View registered members
- Export roster to Google Sheets

### H. Profile
- View current user profile
- Edit profile

### I. Google Sync
- Manual sync to Google Sheets
- Auto-backup to Google Drive
- Generate documents in Google Docs
- View sync history

---

## 5. UI/UX Design System

### Color Palette (Official PMI)
- **Primary Red**: #DC2626
- **Primary Dark**: #991B1B
- **Primary Light**: #FEF2F2
- **Secondary**: #F3F4F6
- **Text Primary**: #1F2937
- **Text Secondary**: #6B7280
- **Success**: #10B981
- **Warning**: #F59E0B
- **Danger**: #EF4444
- **White**: #FFFFFF
- **Background**: #F9FAFB

### Typography
- **Headings**: Inter Bold (700)
- **Body**: Inter Regular (400)
- **Monospace**: JetBrains Mono (for codes, kode anggota)

### Components
- **Sidebar**: Collapsible, animated, icon + text, PMI red accent
- **Cards**: Rounded-xl, subtle shadows, hover:scale-[1.02] transition
- **Tables**: Striped, hover rows, responsive overflow-x-auto
- **Buttons**: Rounded-lg, PMI red primary, hover:bg-red-700, active:scale-95
- **Forms**: Floating labels, validation feedback, focus:ring-2 focus:ring-red-500
- **Modals**: Fade + scale animation, backdrop-blur-sm
- **Charts**: Animated on load, interactive tooltips, PMI red theme

### Animations
- Page transitions: Fade + Slide (Framer Motion)
- Card hover: Scale + Shadow
- Button click: Ripple effect
- Stats counter: Count up animation (AnimatedCounter)
- Sidebar: Slide in/out
- Loading: Skeleton screens + Spinners
- List items: Stagger animation on load

### Responsive Breakpoints
- Mobile: < 640px (single column, bottom nav)
- Tablet: 640px - 1024px (collapsible sidebar)
- Desktop: > 1024px (full sidebar)

---

## 6. Google APIs Integration

### A. Google Sheets API
**Purpose**: Data export and sharing

**Implementation**:
- Service account authentication
- Create/Update spreadsheets in Google Drive
- Sheets structure:
  - One spreadsheet per module (Anggota, Unit, Bencana, Roster)
  - Multiple tabs for sub-categories
- Trigger: Manual button + Daily auto-sync (cron)

**Endpoints**:
- POST /api/google/sync/sheets/:type
- GET /api/google/sheets/:type
- POST /api/google/sync/all

### B. Google Docs API
**Purpose**: Document generation

**Templates**:
- Surat Keterangan Anggota
- Laporan Kegiatan
- Surat Tugas

**Implementation**:
- Service account with Docs API enabled
- Merge placeholders with database data
- Export as PDF

**Endpoints**:
- POST /api/google/docs/generate/:type
- GET /api/google/docs/templates

### C. Google Drive API
**Purpose**: Backup and file storage

**Folder Structure**:
```
Smart Volunteers PMI Kota Cilegon/
├── Backups/
│   ├── Database/
│   │   ├── smart-volunteers-2026-08-22.db
│   │   └── smart-volunteers-2026-08-22.sql
│   └── Exports/
│       ├── anggota-pmr-2026-08-22.xlsx
│       └── roster-2026-08-22.xlsx
├── Documents/
│   ├── Surat Keterangan/
│   └── Laporan/
└── Photos/
    └── anggota/
```

**Implementation**:
- Service account with Drive API enabled
- Upload database backup daily
- Upload exported spreadsheets
- Shareable links for team access

**Endpoints**:
- POST /api/google/drive/backup
- GET /api/google/drive/backups
- POST /api/google/drive/upload

---

## 7. API Endpoints Structure

### Auth
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh

### Markas PMI
- GET /api/markas-pmi
- GET /api/markas-pmi/:id
- POST /api/markas-pmi
- PUT /api/markas-pmi/:id
- DELETE /api/markas-pmi/:id

### Units
- GET /api/units/pmr/mula
- GET /api/units/pmr/madya
- GET /api/units/pmr/wira
- GET /api/units/ksr/markas
- GET /api/units/ksr/perti
- GET /api/units/tsr
- POST /api/units/:type
- PUT /api/units/:type/:id
- DELETE /api/units/:type/:id

### Members
- GET /api/members/pmr
- GET /api/members/ksr
- GET /api/members/tsr
- GET /api/members/:type/:id
- POST /api/members/:type
- PUT /api/members/:type/:id
- DELETE /api/members/:type/:id

### Disasters
- GET /api/disasters
- GET /api/disasters/:id
- POST /api/disasters
- PUT /api/disasters/:id
- DELETE /api/disasters/:id

### Roster
- POST /api/roster/register
- GET /api/roster

### Dashboard
- GET /api/dashboard/stats
- GET /api/dashboard/charts

### Google Sync
- POST /api/google/sync/sheets/:type
- POST /api/google/sync/all
- GET /api/google/sheets/:type
- POST /api/google/docs/generate/:type
- GET /api/google/docs/templates
- POST /api/google/drive/backup
- GET /api/google/drive/backups

---

## 8. Implementation Plan

### Phase 1: Setup & Foundation
- Initialize React + Vite + TypeScript project
- Setup Tailwind CSS with PMI color theme
- Setup routing structure
- Create layout components (Sidebar, Header, Footer)
- Setup API client with React Query
- Initialize Node.js + Express + TypeScript
- Setup Prisma with SQLite
- Create database schema

### Phase 2: Authentication
- Login page with CAPTCHA
- JWT auth flow
- Protected routes
- Logout functionality
- User management

### Phase 3: Dashboard
- Statistics cards with animations
- Charts integration (Recharts)
- Recent activity
- Google Sheets preview widget

### Phase 4: Markas PMI
- List view (single record for Cilegon)
- Create/Edit forms
- Detail view

### Phase 5: Unit Management
- PMR Mula/Madya/Wira
- KSR Markas/Perti
- TSR

### Phase 6: Member Management
- Member lists with pagination
- Member forms
- Status management
- Search and filter
- Export to Google Sheets

### Phase 7: Disaster Management
- Disaster list
- Disaster forms
- Status tracking
- Export laporan

### Phase 8: Roster & Profile
- Roster registration
- User profile

### Phase 9: Google Integration
- Google Sheets sync
- Google Docs generation
- Google Drive backup

### Phase 10: Polish
- Animations refinement
- Responsive testing
- Performance optimization
- Error handling
- Accessibility

---

## 9. File Structure

```
smart-volunteers-pmi/
├── client/                     # React Frontend
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── auth/          # Auth components
│   │   │   ├── dashboard/     # Dashboard components
│   │   │   ├── markas/        # Markas PMI components
│   │   │   ├── units/         # Unit components
│   │   │   ├── members/       # Member components
│   │   │   ├── bencana/       # Disaster components
│   │   │   ├── roster/        # Roster components
│   │   │   └── google/        # Google integration components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   │   └── google/        # Google API services
│   │   ├── utils/             # Utilities
│   │   ├── types/             # TypeScript types
│   │   ├── assets/            # Images, fonts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   │   ├── auth.ts
│   │   │   ├── markas.ts
│   │   │   ├── units.ts
│   │   │   ├── members.ts
│   │   │   ├── bencana.ts
│   │   │   ├── roster.ts
│   │   │   ├── dashboard.ts
│   │   │   └── google.ts
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   ├── services/          # Business logic
│   │   │   ├── google/
│   │   │   │   ├── sheets.ts
│   │   │   │   ├── docs.ts
│   │   │   │   └── drive.ts
│   │   │   └── sync.ts
│   │   ├── models/            # Data models
│   │   ├── utils/             # Utilities
│   │   ├── types/             # TypeScript types
│   │   └── index.ts           # Server entry
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env
│   └── package.json
│
├── LOGIC.md
└── README.md
```

---

## 10. Key Improvements Over Original

1. **Responsive Design**: Mobile-first, works perfectly on phones, tablets, and desktops
2. **Modern UI**: Clean design with PMI corporate colors, consistent spacing, Inter font
3. **Animations**: Smooth page transitions, card hover effects, count-up stats, skeleton loaders
4. **Performance**: Lazy loading, code splitting, optimized images
5. **User Experience**: Instant feedback, toast notifications, loading indicators, error boundaries
6. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
7. **Google Workspace**: All data exportable to Sheets, Docs, and backed up to Drive
8. **Better Data Tables**: Sortable, filterable, paginated with search
9. **Offline Ready**: Service worker for PWA capabilities
10. **City-Focused**: Simplified workflow for Kota Cilegon only

---

## 11. Security Considerations

- JWT with refresh token rotation
- Password hashing with bcrypt (salt rounds: 12)
- CAPTCHA on login to prevent brute force
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS prevention (React auto-escaping)
- HTTPS enforcement in production
- Rate limiting on auth endpoints
- CORS configuration
- Google Service Account with restricted permissions

---

## 12. Deployment Strategy

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Node.js server (port 3000)
- Database: SQLite file (`smart-volunteers.db`)
- Google APIs: Service account JSON credentials

### Production
- Frontend: Built static files served via Nginx
- Backend: PM2 + Node.js
- Database: SQLite with Google Drive backup
- Reverse proxy: Nginx
- SSL: Let's Encrypt
- Google Service Account: Stored securely in environment variables

---

## 13. Google Workspace Setup Required

### Prerequisites
1. Google Cloud Platform project
2. Enable APIs:
   - Google Sheets API
   - Google Docs API
   - Google Drive API
3. Create Service Account
4. Download service account JSON credentials
5. Create Google Drive folder: `Smart Volunteers PMI Kota Cilegon`
6. Share folder with service account email

### Environment Variables
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_DRIVE_FOLDER_ID=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
```

---

## 14. Design Preview

### Landing Page
- Hero section with animated PMI logo
- Statistics cards with count-up animation
- Quick access cards for main features
- Modern gradient backgrounds with PMI red

### Login Page
- Clean, centered card design
- PMI red header
- Floating label inputs
- CAPTCHA image with refresh button
- Smooth transition animations

### Dashboard
- Sidebar with PMI red active state
- Animated stat cards
- Charts with PMI red color scheme
- Recent activity list
- Disaster alert banner

### Tables
- Striped rows with hover effects
- Sortable headers
- Pagination with page numbers
- Action buttons with icons
- Responsive horizontal scroll on mobile

### Forms
- Clean input fields with focus rings
- Validation error messages
- Submit buttons with loading state
- Success/error toast notifications

---

## 15. Project Name & Branding

**App Name**: Smart Volunteers PMI Kota Cilegon  
**Tagline**: Sistem Informasi Manajemen Relawan PMI Kota Cilegon  
**Logo**: PMI logo with "Smart Volunteers" text  
**Colors**: Official PMI Red (#DC2626) + White + Gray  
**Font**: Inter (Google Fonts)

---

## Approval Confirmation

Based on your requirements:

1. **Tech Stack**: React + Node.js + SQLite + Google APIs (all free, open source)
2. **Database**: SQLite (primary) + Google Sheets/Docs/Drive (sync & backup)
3. **Features**: City-level focused (Kota Cilegon only)
4. **Design**: Official PMI corporate colors (#DC2626 red)

This architecture is ready for implementation. Shall I proceed with Phase 1: Setup & Foundation?
