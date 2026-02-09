# PI Capacity Planner v3.2

SAFe 6.0 Enterprise Planning Suite z integracjami, alertami i Monte Carlo.

## ✨ Nowe funkcje v3.2

### 🔌 Integracje (Integrations)

| Źródło | Możliwości |
|--------|------------|
| **Jira** | Sync backlog, velocity historyczne |
| **Azure DevOps** | Sync backlog, work items |
| **BambooHR** | Import PTO/nieobecności |
| **Workday** | Import PTO/nieobecności |

**Konfiguracja:**
1. Wejdź w **Integrations**
2. Podaj API URL, Token i Project Key
3. Kliknij **Test Connection**
4. Użyj **Sync Backlog** / **Sync Velocity** / **Sync PTO**

### 🔔 Alerty automatyczne

| Alert | Kiedy wysyłany |
|-------|----------------|
| **Capacity > 100%** | Przekroczenie capacity zespołu |
| **Capacity > 80%** | Ostrzeżenie o wysokim obciążeniu |
| **Low confidence** | Średnia głosów < 3 |
| **Sprint start** | Przypomnienie o starcie sprintu |
| **PI Planning** | Przypomnienie o PI Planning |
| **High risk** | Dodanie ryzyka o wysokiej ważności |

**Kanały powiadomień:**
- Slack (webhook)
- MS Teams (webhook)
- Email (SMTP)

### 📊 Raporty i Monte Carlo

**Monte Carlo Simulation:**
- 1,000 - 50,000 iteracji
- Percentyle P50, P75, P90, P95
- Histogram rozkładu czasu ukończenia
- Bazuje na historycznym velocity zespołów

**Eksport:**
- **CSV** - pełne dane do dalszej analizy
- **PDF** - profesjonalny raport z wykresami

**Capacity Forecast:**
- Prognoza na kolejne PI
- Porównanie load vs capacity

---

## 🚀 Quick Start

```bash
# 1. Pobierz ZIP i rozpakuj
# 2. Wgraj do GitHub
git add . && git commit -m "v3.2" && git push

# 3. Deploy na Vercel z env vars:
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_ANON_KEY
```

---

## 📁 Architektura

```
┌─────────────────────────────────────────────────────────┐
│                    PI Capacity Planner                   │
├─────────────────────────────────────────────────────────┤
│  Views:                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │
│  │Dashboard│ │ Backlog │ │Capacity │ │Program Board│   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │
│  │Objectives│ │  ROAM   │ │ Voting  │ │Integrations │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ Reports │ │Settings │ │ History │                    │
│  └─────────┘ └─────────┘ └─────────┘                   │
├─────────────────────────────────────────────────────────┤
│  Engines:                                                │
│  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐ │
│  │IntegrationEngine│ │  AlertEngine   │ │MonteCarloEngine│
│  │ - Jira API     │ │ - Slack webhook│ │ - Simulation │ │
│  │ - Azure API    │ │ - Teams webhook│ │ - Histogram  │ │
│  │ - BambooHR API │ │ - Email SMTP   │ │ - Percentile │ │
│  └────────────────┘ └────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Backend: Supabase (Auth, DB, Realtime)                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Flow integracji

```
┌─────────┐     ┌──────────┐     ┌─────────────────┐
│  Jira   │────▶│ PI Planner│────▶│ Slack/Teams/Email│
│  Azure  │     │          │     │                 │
│ BambooHR│     │  Monte   │     │    Alerty       │
│ Workday │     │  Carlo   │     │                 │
└─────────┘     └──────────┘     └─────────────────┘
      │              │                   │
      ▼              ▼                   ▼
  - Backlog      - P50/P75/P90      - Capacity > 100%
  - Velocity     - Histogram        - Low confidence
  - PTO/Abs      - Forecast         - Sprint reminder
```

---

## 📈 Monte Carlo - jak to działa?

1. **Input:** Historyczne velocity zespołów (ostatnie 6 sprintów)
2. **Model:** Rozkład normalny z mean i std dev
3. **Symulacja:** 10,000 losowych scenariuszy
4. **Output:**
   - P50 = 50% szans na ukończenie w X sprintów
   - P75 = 75% szans (rekomendowane dla planowania)
   - P90 = 90% szans (bezpieczny bufor)

**Interpretacja:**
- Jeśli P50 = 4, P90 = 6 → planuj 5-6 sprintów
- Duża różnica P50-P90 = wysoka niepewność

---

## 🔧 Konfiguracja webhooków

### Slack
```
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

### MS Teams
```
https://outlook.office.com/webhook/...
```

### Email (SMTP)
```
smtp://user:pass@smtp.gmail.com:587
```

---

## 📦 Pliki

| Plik | Opis |
|------|------|
| `src/App.jsx` | Główna aplikacja (~1100 linii) |
| `src/supabase.js` | Klient Supabase |
| `supabase-schema.sql` | Schema bazy danych |

---

## 🛡️ Bezpieczeństwo

- API keys przechowywane w localStorage (do poprawy: Supabase secrets)
- Webhooks wysyłane server-side (wymaga backend proxy w produkcji)
- RLS na wszystkich tabelach Supabase
