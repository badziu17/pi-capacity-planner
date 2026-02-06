# PI Capacity Planner v3.0

SAFe 6.0 Enterprise Planning Suite z Supabase.

## 🚀 Szybki Deploy na Vercel

### 1. Wgraj pliki na GitHub

Opcja A - przez GitHub.com:
1. Wejdź na https://github.com/badziu17/pi-capacity-planner
2. Kliknij "Add file" → "Upload files"
3. Przeciągnij wszystkie pliki z tego ZIP (nie folder, pliki!)
4. Commit changes

Opcja B - przez git:
```bash
git clone https://github.com/badziu17/pi-capacity-planner.git
cd pi-capacity-planner
# skopiuj wszystkie pliki z ZIP do tego folderu
git add .
git commit -m "PI Capacity Planner v3.0"
git push
```

### 2. Skonfiguruj Supabase

1. Wejdź na https://supabase.com i załóż konto
2. Create new project
3. **Settings → API** - skopiuj:
   - Project URL: `https://xxx.supabase.co`
   - anon public key: `eyJhbGciOiJI...`
4. **SQL Editor** - uruchom cały plik `supabase-schema.sql`
5. **Authentication → Settings → Email Auth** - włącz rejestrację

### 3. Deploy na Vercel

1. Wejdź na https://vercel.com
2. Import z GitHub → wybierz `pi-capacity-planner`
3. W **Environment Variables** dodaj:
   - `VITE_SUPABASE_URL` = twój Project URL
   - `VITE_SUPABASE_ANON_KEY` = twój anon key
4. Deploy!

### 4. Zarejestruj użytkowników

Po deploy wejdź na URL aplikacji i zarejestruj konta dla zespołu.

---

## ✨ Funkcjonalności v3.0

### Nowe w tej wersji:
- ✅ **Edytowalne zespoły i osoby w Settings** - kliknij na nazwę aby edytować
- ✅ **Przypisanie osoby do Feature** - wybierz zespół i osobę realizującą
- ✅ **Supabase Auth** - logowanie i rejestracja
- ✅ **Real-time sync** - zmiany widoczne dla wszystkich użytkowników
- ✅ **Historia zmian** - kto, co, kiedy zmienił

### Moduły:
| Moduł | Funkcjonalność |
|-------|----------------|
| **Dashboard** | Przegląd PI, capacity zespołów, features, ryzyka |
| **Capacity** | Planowanie MD z nieobecnościami per osoba/sprint |
| **Program Board** | Drag-and-drop features, milestones, dependencies |
| **PI Objectives** | Committed/Uncommitted, Predictability Measure |
| **ROAM Board** | Zarządzanie ryzykami z drag-and-drop |
| **Confidence Vote** | Fist of Five z timerem |
| **Settings** | Edycja zespołów, członków, język (EN/PL) |
| **History** | Pełna historia zmian z timestampami |

---

## 🛠 Development

```bash
# Zainstaluj zależności
npm install

# Uruchom lokalnie
npm run dev

# Build
npm run build
```

---

## 📁 Struktura

```
├── src/
│   ├── App.jsx         # Główna aplikacja
│   ├── supabase.js     # Supabase client
│   ├── main.jsx        # Entry point
│   └── index.css       # Tailwind
├── supabase-schema.sql # Schema bazy danych
├── package.json
└── vite.config.js
```
