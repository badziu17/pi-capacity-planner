# PI Capacity Planner v4.0 — Capacity vs Demand

**"Why" tego narzędzia: Widzieć capacity vs demand na pierwszy rzut oka.**

## 🎯 Core Screen: Capacity Board

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CAPACITY VS DEMAND — PI 2025.1                    ART Total: 340/375 SP   │
│                                                    Load Factor: 91%        │
├──────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────┤
│ Team         │ Sprint 1    │ Sprint 2    │ Sprint 3    │ Sprint 4    │ IP  │
├──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤
│ Team Alpha   │ ██████░░    │ ████████    │ █████░░░    │ ██████░░    │ ██  │
│ 40 SP/sprint │ 35/40 (88%) │ 40/40 100%  │ 25/40 (63%) │ 32/40 (80%) │ 8/8 │
│              │ • OAuth2    │ • Profiles  │ • Permiss.  │             │     │
│              │ • Email ver │ • Avatar    │             │             │     │
├──────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┤
│ Team Beta    │ █████████   │ ██████░░    │ ████░░░░    │             │     │
│ 35 SP/sprint │ 48/35 137%! │ 35/35 100%  │ 20/35 (57%) │ 0/35        │     │
│              │ • REST API  │ • Charts    │             │             │     │
│              │ • DB Migr.  │             │             │             │     │
└──────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────┘

🟢 ≤80% Healthy   🟡 80-100% Warning   🔴 >100% Overcommit
```

## ✨ Funkcjonalności

### 1️⃣ Capacity Board (główny ekran)
- **Tabela zespół × sprint** z wizualizacją load factor
- **Kolory:** zielony ≤80%, żółty 80-100%, czerwony >100%
- **Drag & drop** - przeciągnij item z "Unplanned" do komórki
- **ART Total** - suma capacity i demand dla całego ART
- **Szczegóły w komórce** - lista przypisanych items

### 2️⃣ Konfiguracja zespołów
- **Definicja zespołu:** nazwa, kolor, velocity (SP/sprint)
- **Członkowie:** imię, FTE (0.1-1.0), rola
- **Nieobecności:** dni absencji per osoba per sprint
- **Święta:** kalendarz PL 2025 (13 dni)
- **Capacity = workdays × FTE - absences**

### 3️⃣ Struktura SAFe
```
ART (Agile Release Train)
├── Team Alpha
├── Team Beta  
└── Team Gamma
    └── PI 2025.1 (PI44)
        ├── Sprint 1 (10 work days)
        ├── Sprint 2
        ├── Sprint 3
        ├── Sprint 4
        └── IP Sprint (Innovation & Planning)
```

### 4️⃣ Backlog & Work Items
- **Typy:** Epic, Feature, Story, Enabler
- **Quick Add:** typ + nazwa + SP + team → Enter
- **Estymacja:** Fibonacci (1,2,3,5,8,13,20,40,100)
- **WSJF:** priorytetyzacja
- **Przypisanie:** team + sprint (drag & drop lub edit)

### 5️⃣ Program Board
- **Widok Features** per team per sprint
- **Milestones** (MVP, Beta Launch)
- **Dependencies** wizualizacja

---

## 🚀 Quick Start

```bash
# 1. Rozpakuj ZIP
unzip pi-capacity-planner-v4.zip

# 2. Install & run
cd pi-capacity-planner-v3
npm install
npm run dev

# 3. Otwórz http://localhost:5173
# 4. Kliknij "Demo Mode" - dane przykładowe załadowane
```

---

## 📊 Jak działa Capacity?

### Wzór na Capacity (SP)
```
Team Capacity per Sprint = Base Velocity × Availability Factor

Availability Factor = 
  (Total Work Days - Sum of Absences) / Total Work Days × Avg FTE

Przykład Team Alpha, Sprint 2:
- Base Velocity: 40 SP
- Work Days: 10
- Anna: 2 dni PTO → 8 dni
- Maria: FTE 0.8 → 8 dni effective
- Piotr, Jan: pełne 10 dni
- Availability: (8+8+10+10) / (4×10) = 0.9
- Effective Capacity: 40 × 0.9 = 36 SP
```

### Load Factor
```
Load = Demand / Capacity × 100%

🟢 ≤80%  — Healthy buffer for unknowns
🟡 80-100% — At risk, no buffer
🔴 >100% — Overcommit! Needs rebalancing
```

---

## 🗂️ Pliki

```
pi-capacity-planner-v3/
├── src/
│   ├── App.jsx          # Główna aplikacja (1400+ linii)
│   ├── supabase.js      # Klient Supabase (opcjonalny)
│   ├── main.jsx
│   └── index.css
├── public/favicon.svg
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🎨 UI/UX Design

- **Glass morphism** z ciemnym tematem
- **Gradient accents** cyan → emerald
- **Responsive** tables z sticky kolumnami
- **Hover states** i **transitions**
- **Bilingual** EN/PL

---

## 🔧 Rozszerzenia (TODO)

- [ ] Supabase persistence
- [ ] Jira/Azure DevOps sync
- [ ] Slack/Teams alerts
- [ ] Monte Carlo forecasting
- [ ] PDF/CSV export
- [ ] Real-time collaboration

---

## 📝 Licencja

MIT — do użytku wewnętrznego i komercyjnego.
