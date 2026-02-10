# PI Capacity Planner v5.0 — Enterprise Edition

**SAFe 6.0 PI Planning Tool z pełnym zestawem funkcji enterprise.**

## 🎯 Nowe funkcje v5.0

### 1️⃣ RTE Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  PI Health Score: 78%                                       │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│ Total    │ Total    │ Avg Load │ Reserve  │ Overbooked     │
│ Capacity │ Demand   │          │          │ Sprints        │
│ 525 SP   │ 420 SP   │ 80%      │ 105 SP   │ 2              │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│  Sprint Load Trend                                          │
│  S1: ████████░░ 85%    S4: ██████░░░░ 65%                  │
│  S2: █████████░ 92%    IP: ██░░░░░░░░ 20%                  │
│  S3: ███████░░░ 75%                                        │
├─────────────────────────────────────────────────────────────┤
│  Team Breakdown                                             │
│  Alpha  ██████████ 95%  ⚠️ 1 overbooked                    │
│  Beta   ████████░░ 82%  ✓ On track                         │
│  Gamma  ██████░░░░ 65%  ✓ On track                         │
└─────────────────────────────────────────────────────────────┘
```

### 2️⃣ What-If Scenarios
| Scenariusz | Opis | Porównanie |
|------------|------|------------|
| **Baseline** | Obecny stan | — |
| **Scenario A** | Team Beta -20% capacity | Load: +12%, Reserve: -40 SP |
| **Scenario B** | +Team Delta (25 SP/sprint) | Load: -15%, Reserve: +125 SP |

**Typy zmian:**
- Reduce capacity (np. urlopy, choroby)
- Add/Remove team
- Move item to different PI
- Change sprint assignment

### 3️⃣ Dependencies Visualization
```
┌─────────────────────────────────────────────────────────────┐
│  Dependencies                                               │
├───────────────┬─────┬───────────────┬────────┬─────────────┤
│ Provider      │  →  │ Consumer      │ Status │ Warning     │
├───────────────┼─────┼───────────────┼────────┼─────────────┤
│ REST API v1   │  →  │ OAuth2 Auth   │ ✓ OK   │             │
│ Team Beta S1  │     │ Team Alpha S2 │        │             │
├───────────────┼─────┼───────────────┼────────┼─────────────┤
│ Charts        │  →  │ Data Export   │ ⚠️ Risk│ Low reserve │
│ Team Beta S2  │     │ Team Gamma S2 │        │             │
└───────────────┴─────┴───────────────┴────────┴─────────────┘

Status:
🟢 Healthy - Provider ends before consumer starts
🟡 At Risk - Same sprint, low reserve in target
🔴 Violated - Provider ends after consumer starts
```

### 4️⃣ Risks & Confidence Vote
```
┌─────────────────────────────────────────────────────────────┐
│  ART Average Confidence: 3.7/5                              │
├─────────────────────────────────────────────────────────────┤
│  Team Alpha    [1] [2] [3] [4•] [5]  → 4/5 Minor concerns  │
│  Team Beta     [1] [2] [3•] [4] [5]  → 3/5 Neutral         │
│  Team Gamma    [1] [2] [3] [4•] [5]  → 4/5 Minor concerns  │
├─────────────────────────────────────────────────────────────┤
│  Top Risks                                                  │
│  🔴 HIGH   Third-party API rate limits    [Owned]          │
│  🟡 MEDIUM New team member onboarding     [Mitigated]      │
│  🟢 LOW    Database performance           [Accepted]       │
└─────────────────────────────────────────────────────────────┘
```

**ROAM Status:**
- **R**esolved - Risk is no longer a concern
- **O**wned - Someone is actively working on it
- **A**ccepted - We accept the risk and move forward
- **M**itigated - Actions taken to reduce impact

### 5️⃣ Import (Jira / CSV)
```
┌─────────────────────────────────────────────────────────────┐
│  Import from Jira                                           │
│  URL: https://company.atlassian.net                        │
│  Token: ••••••••••••                                       │
│  Project: PROJ                                              │
│  [Fetch Items]                                              │
├─────────────────────────────────────────────────────────────┤
│  Import from CSV                                            │
│  📄 Select file...                                          │
│                                                             │
│  Preview: 15 rows                                           │
│  ┌────────┬──────────────────┬────┬────────┐              │
│  │ Type   │ Name             │ SP │ Team   │              │
│  ├────────┼──────────────────┼────┼────────┤              │
│  │ Feature│ User Login       │ 20 │ Alpha  │              │
│  │ Story  │ Password Reset   │ 5  │ Alpha  │              │
│  └────────┴──────────────────┴────┴────────┘              │
│  [Import]                                                   │
└─────────────────────────────────────────────────────────────┘
```

### 6️⃣ Role-Based Access Control
| Rola | Edycja | Usuwanie | Import | Zarządzanie użytkownikami |
|------|--------|----------|--------|---------------------------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **RTE/PM** | ✅ | ✅ | ✅ | ❌ |
| **Team Lead** | ✅ | ❌ | ❌ | ❌ |
| **Member** | ❌ | ❌ | ❌ | ❌ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ |

### 7️⃣ Audit Trail
```
┌────────────────────┬──────────────────┬──────────┬─────────────────────┐
│ Timestamp          │ User             │ Action   │ Details             │
├────────────────────┼──────────────────┼──────────┼─────────────────────┤
│ 2025-02-01 10:00   │ anna@company.com │ Created  │ Created OAuth2 Auth │
│ 2025-02-02 14:30   │ jan@company.com  │ Updated  │ Changed SP 40→48    │
│ 2025-02-03 09:15   │ maria@company.com│ Deleted  │ Removed old feature │
└────────────────────┴──────────────────┴──────────┴─────────────────────┘
```

---

## 📁 Struktura nawigacji

```
┌─────────────────────────────────────────┐
│  🏠 RTE Dashboard    ← Główny widok     │
│  📊 Capacity Board   ← Capacity vs Demand│
│  📋 PI Backlog       ← Work items        │
│  👥 Teams            ← Konfiguracja      │
│  📌 Program Board    ← Features timeline │
│  🔗 Dependencies     ← Cross-team deps   │
│  🔄 What-If          ← Scenariusze       │
│  ⚠️ Risks            ← ROAM + Confidence │
│  ⚙️ Settings         ← Import + Audit    │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# 1. Rozpakuj i zainstaluj
unzip pi-capacity-planner-v5.zip
cd pi-capacity-planner-v3
npm install

# 2. Uruchom
npm run dev

# 3. Wybierz rolę w Demo Mode:
#    - Admin (pełne uprawnienia)
#    - RTE/PM (bez zarządzania użytkownikami)
#    - Team Lead (tylko edycja)
#    - Member/Viewer (tylko podgląd)
```

---

## 📊 Metryki PI Health Score

```
Health Score = 100 
  - (Overbooked Sprints × 10)
  - (At-Risk Dependencies × 5)
  - ((5 - Avg Confidence) × 10)

Przykład:
  100 - (2 × 10) - (1 × 5) - ((5 - 3.7) × 10)
  = 100 - 20 - 5 - 13 = 62%

🟢 ≥70%  - Healthy
🟡 40-69% - At Risk  
🔴 <40%  - Critical
```

---

## 🔧 Konfiguracja CSV Import

**Wymagane kolumny:**
```csv
Type,Name,SP,Team,Sprint,Description,WSJF
feature,User Login,20,Team Alpha,1,OAuth2 implementation,18
story,Password Reset,5,Team Alpha,1,Email flow,12
enabler,CI/CD Setup,8,Team Gamma,1,GitHub Actions,25
```

**Mapowanie pól:**
| CSV Column | PI Planner Field |
|------------|------------------|
| Type | item.type |
| Name | item.name |
| SP | item.sp |
| Team | item.teamId (by name) |
| Sprint | item.sprint |
| Description | item.description |
| WSJF | item.wsjf |

---

## 🔒 Security Notes

1. **API Keys** - przechowywane w localStorage (do poprawy: Supabase secrets)
2. **Audit Log** - wszystkie zmiany logowane z user + timestamp
3. **RBAC** - sprawdzenie uprawnień przed każdą operacją
4. **Demo Mode** - żadne dane nie są wysyłane na serwer

---

## 📦 Pliki

```
pi-capacity-planner-v3/
├── src/
│   ├── App.jsx          # Główna aplikacja (1450+ linii)
│   ├── supabase.js      # Klient Supabase (opcjonalny)
│   ├── main.jsx
│   └── index.css
├── public/favicon.svg
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Widoki

| Widok | Opis | Główne metryki |
|-------|------|----------------|
| **RTE Dashboard** | Overview PI health | Score, Load, Reserve, Risks |
| **Capacity Board** | Team × Sprint matrix | Capacity, Demand, Load % |
| **Backlog** | All work items | Type, SP, Team, Sprint |
| **Teams** | Config & absences | Velocity, FTE, PTO |
| **Program Board** | Timeline view | Features, Milestones |
| **Dependencies** | Cross-team deps | Status, Warnings |
| **What-If** | Scenario comparison | Delta load, reserve |
| **Risks** | ROAM + Confidence | Severity, Avg vote |
| **Settings** | Import + Audit | CSV, Jira, History |

---

## 🛣️ Roadmap

- [ ] Real Jira API integration
- [ ] Real-time collaboration (Supabase Realtime)
- [ ] PDF export reports
- [ ] Monte Carlo forecasting
- [ ] Slack/Teams notifications
- [ ] Multi-ART support

---

**Wersja:** 5.0  
**Licencja:** MIT
