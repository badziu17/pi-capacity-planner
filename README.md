# PI Capacity Planner v7.0 — Full Enterprise + AI Edition

**SAFe 6.0 PI Planning Tool with AI forecasting, bidirectional sync, and multi-ART portfolio management.**

## 🆕 New in v7.0

### 1️⃣ AI Velocity Forecasting (Predictive Analytics)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🤖 AI Velocity Forecast                                         │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Next PI      │ │ Range        │ │ Confidence   │              │
│ │ 525 SP       │ │ 480-570 SP   │ │ 78%          │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│ Team Alpha: 40 → 43 SP ↑  (Improving velocity trend)            │
│ Team Beta:  35 → 36 SP →  (Stable)                              │
│ Team Gamma: 30 → 28 SP ↓  (High variance, investigate)          │
├─────────────────────────────────────────────────────────────────┤
│ Recommendation: High forecast confidence. Safe to plan at P50.  │
└─────────────────────────────────────────────────────────────────┘
```

**Algorithm:**
- Linear regression on historical velocity (6-8 sprints)
- Seasonality detection
- R² confidence scoring
- Risk-adjusted capacity calculation

```javascript
// AIForecastEngine.analyzeVelocityTrend()
const forecast = AIForecastEngine.forecastART(teams);
// Returns: { totalForecast, totalLow, totalHigh, avgConfidence, recommendation }
```

### 2️⃣ Bidirectional Sync (Jira / Azure DevOps)

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔷 Jira Cloud — Bidirectional Sync              [Connected ✓]  │
├─────────────────────────────────────────────────────────────────┤
│ [Test Connection] [🔄 Sync Now] [✓ Auto-sync every 5 min]      │
├─────────────────────────────────────────────────────────────────┤
│ Last sync: 2025-02-10 14:32:15                                  │
│ ⚠️ 3 pending changes to sync                                    │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- **Push changes** to Jira/ADO when items are created/updated
- **Pull updates** from external systems
- **Conflict detection** with resolution options (keep local/remote/manual)
- **Auto-sync** every 5 minutes (configurable)
- **Change tracking** with pending queue

```javascript
// SyncEngine.fullSync()
const result = await SyncEngine.fullSync(config, onProgress);
// Returns: { pushed: 5, pulled: 3, conflicts: 0, syncedAt: '...' }
```

### 3️⃣ Real Notifications (Slack / Teams / Email)

```
┌─────────────────────────────────────────────────────────────────┐
│ Alert Triggers                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [✓] 🔴 Capacity over 100% (overcommit)                         │
│ [✓] 🟡 Capacity over 80% (warning)                             │
│ [✓] ⚠️ Low confidence vote (<3)                                │
│ [ ] 📅 Sprint starting reminder                                 │
│ [ ] 🚀 PI starting reminder                                     │
│ [✓] 🔄 Scenario changed                                        │
├─────────────────────────────────────────────────────────────────┤
│ Channels:                                                       │
│ 💬 Slack  [✓] https://hooks.slack.com/...  [Test]              │
│ 👥 Teams  [ ] ________________________     [Test]              │
│ 📧 Email  [ ] ________________________     [Test]              │
└─────────────────────────────────────────────────────────────────┘
```

**NotificationEngine:**
```javascript
// Auto-check and notify
await NotificationEngine.checkAndNotify({ teams, items, sprints }, alertConfig);

// Manual notification
await NotificationEngine.notify(config, { 
  type: 'danger', 
  message: '🔴 Team Alpha Sprint 2: 120% capacity!' 
});
```

### 4️⃣ Portfolio / Multi-ART View

```
┌─────────────────────────────────────────────────────────────────┐
│ 📊 Portfolio View — Multi-ART Capacity Management               │
├─────────────────────────────────────────────────────────────────┤
│ ARTs: 2    Total Cap: 945 SP    Demand: 780 SP    Load: 83%    │
├─────────────────────────────────────────────────────────────────┤
│ 🤖 AI Suggestion: Move capacity from "Customer Platform ART"   │
│    to "Internal Tools ART" (25 SP) to optimize load balance    │
│                                            [Rebalance Capacity] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌─────────────────────────┐        │
│ │ Customer Platform ART   │ │ Internal Tools ART      │        │
│ │ 3 teams • 9 items       │ │ 2 teams • 4 items       │        │
│ │ ████████████░░░░ 87%    │ │ ██████████░░░░░░ 65%    │        │
│ │ Cap: 630 SP             │ │ Cap: 315 SP             │        │
│ │ Demand: 548 SP          │ │ Demand: 205 SP          │        │
│ │ 🤖 Next PI: 645 SP      │ │ 🤖 Next PI: 320 SP      │        │
│ └─────────────────────────┘ └─────────────────────────┘        │
├─────────────────────────────────────────────────────────────────┤
│ Cross-ART Dependencies:                                         │
│ ⛓ Admin Panel → Report Generator (cross-ART)                   │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- View all ARTs side-by-side
- Portfolio-level capacity/demand metrics
- AI optimization suggestions for rebalancing
- Cross-ART dependency tracking
- Per-ART AI forecasts

### 5️⃣ Enhanced PDF Export

```javascript
// Opens print dialog for PDF generation
await MonteCarloEngine.generatePDF({
  teams, items, simulation, pi, forecast
});
```

**PDF includes:**
- Monte Carlo results (P50/P75/P90)
- AI forecasts with confidence
- Team breakdown table
- Backlog items summary

---

## ✅ Complete Feature List

| Category | Feature | Status |
|----------|---------|--------|
| **Core** | Capacity vs Demand Board | ✅ |
| | Team × Sprint matrix | ✅ |
| | Drag-and-drop assignment | ✅ |
| | Color-coded overcommit | ✅ |
| **Teams** | FTE configuration | ✅ |
| | Absence tracking | ✅ |
| | Holiday calendar | ✅ |
| | Historical velocity | ✅ |
| **SAFe** | ART structure | ✅ |
| | PI configuration | ✅ |
| | IP Sprint (20% capacity) | ✅ |
| **Backlog** | Quick Add items | ✅ |
| | Epic/Feature/Story/Enabler | ✅ |
| | Clickable with full details | ✅ |
| | Description + AC | ✅ |
| | Status tracking | ✅ |
| **AI/Analytics** | Velocity forecasting | ✅ |
| | Trend analysis | ✅ |
| | Confidence scoring | ✅ |
| | Risk-adjusted capacity | ✅ |
| | Monte Carlo simulation | ✅ |
| **Integrations** | Jira Cloud | ✅ |
| | Azure DevOps | ✅ |
| | CSV import | ✅ |
| | Bidirectional sync | ✅ |
| | Change tracking | ✅ |
| **Notifications** | Slack webhooks | ✅ |
| | Teams webhooks | ✅ |
| | Email (via webhook) | ✅ |
| | Capacity alerts | ✅ |
| | Sprint reminders | ✅ |
| **Portfolio** | Multi-ART view | ✅ |
| | Cross-ART dependencies | ✅ |
| | AI rebalancing suggestions | ✅ |
| **Reports** | CSV export | ✅ |
| | PDF export | ✅ |
| | AI recommendations | ✅ |
| **Other** | What-If scenarios | ✅ |
| | Dependencies visualization | ✅ |
| | Risks & Confidence | ✅ |
| | Role-based access | ✅ |
| | Audit trail | ✅ |
| | Bilingual (EN/PL) | ✅ |

---

## 🚀 Quick Start

```bash
unzip pi-capacity-planner-v7.zip
cd pi-capacity-planner-v3
npm install
npm run dev
# → http://localhost:5173
```

---

## 📁 Navigation

```
├── 📊 RTE Dashboard     — PI health overview
├── 📈 Capacity Board    — CORE: Team × Sprint
├── 📋 PI Backlog        — Items + Quick Add
├── 👥 Teams             — Config + PTO
├── 📌 Program Board     — SAFe timeline
├── 🔗 Dependencies      — Cross-team
├── 🔄 What-If           — Scenarios
├── ⚠️ Risks             — ROAM + Fist of 5
├── 📉 Reports & AI      — Monte Carlo + Forecasts
├── 📊 Portfolio         — Multi-ART view
└── ⚙️ Settings          — Integrations + Alerts
```

---

## 🔧 Technical Details

**Stack:**
- React 18 + Vite
- Tailwind CSS
- No external state management (React Context)

**Engines:**
- `AIForecastEngine` — Linear regression + seasonality
- `MonteCarloEngine` — Simulation + PDF/CSV export
- `SyncEngine` — Bidirectional sync with conflict detection
- `NotificationEngine` — Multi-channel alerts

**Lines of code:** 1,670
**Demo data:** 2 ARTs, 5 teams, 13 items, 4 dependencies, 3 risks

---

**Version:** 7.0 Complete  
**License:** MIT
