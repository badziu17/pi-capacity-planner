# PI Capacity Planner v3.1

SAFe 6.0 Enterprise Planning Suite z hierarchią Epic→Feature→Story i automatyzacją.

## ✨ Nowe funkcje v3.1

### 📂 Hierarchia Epic → Feature → Story
- **Epic** - duże inicjatywy (poziom Portfolio)
- **Feature** - dostarczane w PI (poziom Program)
- **Story** - dostarczane w Sprint (poziom Team)
- Linkowanie parent/child między poziomami
- Widok hierarchiczny i płaski w Backlog

### 📝 Description & Acceptance Criteria
- Pole opisu dla każdego elementu
- Acceptance Criteria w formacie checklist
- **AI-generated AC** - kliknij "Generate AC with AI"

### 🤖 Automatyzacje
| Funkcja | Opis |
|---------|------|
| **Auto-status propagation** | Status Epic = najgorszy status Features |
| **Auto-SP aggregation** | SP Epic = suma SP Features |
| **Suggest Sprint** | Sugestia na podstawie capacity i zależności |
| **Suggest Assignee** | Sugestia najmniej obciążonej osoby |
| **AI Story Breakdown** | Rozbij Feature na Stories jednym kliknięciem |

### ⚙️ Ustawienia automatyzacji
W Settings → Automation Settings możesz włączyć/wyłączyć:
- Auto-propagate status
- Auto-aggregate SP
- Show auto-suggestions

---

## 🚀 Deploy

### 1. GitHub
```bash
# Wgraj wszystkie pliki do repo
git add .
git commit -m "PI Capacity Planner v3.1"
git push
```

### 2. Supabase
1. Utwórz projekt na supabase.com
2. Uruchom `supabase-schema.sql` w SQL Editor
3. Skopiuj URL i anon key

### 3. Vercel
1. Import z GitHub
2. Dodaj Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

---

## 📁 Struktura danych

```
Epic (Portfolio level)
├── Feature 1 (Program level)
│   ├── Story 1.1 (Team level)
│   ├── Story 1.2
│   └── Story 1.3
└── Feature 2
    └── Story 2.1
```

### Pola elementu
```typescript
{
  id: string,
  type: 'epic' | 'feature' | 'story',
  name: string,
  description: string,
  acceptance_criteria: string,
  story_points: number,
  business_value: number (1-10),
  team_id: string | null,
  assignee_id: string | null,
  sprint: number | null,
  status: 'notStarted' | 'inProgress' | 'done' | 'blocked',
  parent_id: string | null
}
```

---

## 🔧 Development

```bash
npm install
npm run dev
```

---

## 🎯 Flow automatyzacji

1. **Tworzysz Epic** - np. "User Management Platform"
2. **Dodajesz Features** - linkujesz do Epic
3. **Klikasz "Breakdown to Stories"** - AI generuje Stories
4. **Przypisujesz zespół** - klikasz "Suggest Sprint" i "Suggest Assignee"
5. **Status się propaguje** - gdy Stories są done, Feature i Epic automatycznie się aktualizują
