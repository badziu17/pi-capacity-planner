# Ventura v6 — Group Travel OS 🗺️

Interactive group travel planning app with maps, expense splitting, AI planner, and PWA support.

## Features
- 🗺️ **MapLibre GL** interactive maps with per-day pins & routes
- 💸 **Expense splitting** with "who paid" tracking & settlement calculations
- 🤖 **AI group consensus** planner with preference voting
- 📱 **PWA** with offline support & install prompt
- 🔗 **Trip sharing** with public links & ICS calendar export
- 🎒 **Packing lists** with templates, assignments & AI suggestions
- 📓 **Travel journal** with per-user entries
- 🏨 **Booking comparison** with group voting
- 🌍 **Bilingual** PL/EN with full i18n
- 🎫 **Ticket tracking** for paid attractions
- 👥 **Role-based access** (admin/companion/observer/guest)
- 🎉 **Vacation celebration** when all members get PTO approved

## Quick Start
```bash
npm install
cp .env.example .env.local
# Add your Supabase credentials to .env.local
npm run dev
```

## Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in SQL Editor
3. Enable Google OAuth in Authentication settings
4. Copy URL + anon key to `.env.local`

## Deploy to Vercel
```bash
npm run build
# Upload dist/ or connect Git repo
```

## Tech Stack
- React 18 + Vite 5
- MapLibre GL JS 4.1 (OpenFreeMap tiles — no API key)
- Supabase (PostgreSQL + Auth + Realtime)
- PWA (Service Worker + Web App Manifest)

## Bundle
- App: ~296 KB (77 KB gzip)
- Map: ~798 KB (211 KB gzip, loaded on demand)
- Vendor: ~140 KB (45 KB gzip)
