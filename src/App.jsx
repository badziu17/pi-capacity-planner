import React, { useState, useMemo, createContext, useContext, useEffect, useCallback } from 'react';
import { supabase, auth, db, realtime, isConfigured } from './supabase.js';

const AppContext = createContext();
const useApp = () => useContext(AppContext);

const T = {
  en: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Enterprise Planning Suite' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', backlog: 'Backlog', objectives: 'PI Objectives', risks: 'ROAM Board', voting: 'Confidence Vote', integrations: 'Integrations', reports: 'Reports', settings: 'Settings', history: 'History' },
    auth: { signIn: 'Sign In', signUp: 'Sign Up', signOut: 'Sign Out', email: 'Email', password: 'Password', name: 'Full Name', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', demoMode: 'Demo Mode', configureSupabase: 'Configure Supabase in .env' },
    dash: { title: 'PI Dashboard', calDays: 'Calendar Days', workDays: 'Working Days', teamCap: 'Team Capacity', allocated: 'Allocated', util: 'Utilization', features: 'Features', risks: 'Open Risks', epics: 'Epics', stories: 'Stories' },
    cap: { title: 'Capacity Planning', max: 'Max Capacity', net: 'Net Capacity', abs: 'Absences', warn: 'Warning: Over 80%', danger: 'Over capacity!' },
    board: { title: 'Program Board', addFeat: 'Add Feature', name: 'Name', sp: 'Story Points', bv: 'Business Value', status: 'Status', notStarted: 'Not Started', inProgress: 'In Progress', done: 'Done', blocked: 'Blocked', healthy: 'Healthy', atRisk: 'At Risk', violated: 'Violated', miles: 'Milestones', teams: 'Teams', assignee: 'Assignee', selectTeam: 'Select team', selectPerson: 'Select person', desc: 'Description', ac: 'Acceptance Criteria', epic: 'Epic', feature: 'Feature', story: 'Story', parent: 'Parent', children: 'Children', generateAC: 'Generate AC with AI', suggestSprint: 'Suggest Sprint', suggestAssignee: 'Suggest Assignee', breakdownStories: 'Breakdown to Stories', unassigned: 'Unassigned' },
    obj: { title: 'PI Objectives', committed: 'Committed', uncommitted: 'Uncommitted', add: 'Add Objective', predict: 'Predictability Measure', target: 'Target: 80-100%', actual: 'Actual' },
    risk: { title: 'ROAM Board', resolved: 'Resolved', owned: 'Owned', accepted: 'Accepted', mitigated: 'Mitigated', add: 'Add Risk', owner: 'Owner', severity: 'Severity', high: 'High', medium: 'Medium', low: 'Low', due: 'Due Date', feature: 'Linked Feature', none: 'No risks' },
    vote: { title: 'Confidence Vote', fof: 'Fist of Five', start: 'Start Voting', end: 'End Voting', your: 'Your Vote', avg: 'Average', dist: 'Distribution', noVotes: 'No votes yet', exp: { 5: 'Full confidence', 4: 'Minor concerns', 3: 'Neutral', 2: 'Reservations', 1: 'Cannot commit' } },
    int: { title: 'Integrations', jira: 'Jira', azure: 'Azure DevOps', github: 'GitHub', bamboo: 'BambooHR', workday: 'Workday', slack: 'Slack', teams: 'MS Teams', email: 'Email (SMTP)', connected: 'Connected', disconnected: 'Not connected', connect: 'Connect', disconnect: 'Disconnect', sync: 'Sync Now', lastSync: 'Last sync', apiUrl: 'API URL', apiKey: 'API Key / Token', projectKey: 'Project Key', webhookUrl: 'Webhook URL', syncBacklog: 'Sync Backlog', syncVelocity: 'Sync Velocity', syncPTO: 'Sync PTO/Absences', testConnection: 'Test Connection', importData: 'Import Data', configureAlerts: 'Configure Alerts' },
    alerts: { title: 'Alert Settings', capacityOver: 'Capacity over 100%', capacityWarn: 'Capacity over 80%', lowConfidence: 'Low confidence vote (<3)', sprintStart: 'Sprint starting', piStart: 'PI Planning reminder', riskHigh: 'High severity risk added', enabled: 'Enabled', threshold: 'Threshold', channels: 'Notification Channels' },
    reports: { title: 'Reports & Forecasts', export: 'Export', pdf: 'Export PDF', csv: 'Export CSV', capacityForecast: 'Capacity Forecast', monteCarlo: 'Monte Carlo Simulation', simulations: 'Simulations', confidence: 'Confidence Level', p50: '50th percentile', p75: '75th percentile', p90: '90th percentile', historicalVelocity: 'Historical Velocity', projectedCompletion: 'Projected Completion', riskAnalysis: 'Risk Analysis', runSimulation: 'Run Simulation', generating: 'Generating...', iterations: 'iterations' },
    set: { title: 'Settings', lang: 'Language', editTeams: 'Edit Teams & Members', addTeam: 'Add Team', addMember: 'Add Member', teamName: 'Team Name', velocity: 'Velocity', autoFeatures: 'Automation Settings', autoStatus: 'Auto-propagate status', autoSP: 'Auto-aggregate SP', autoSuggest: 'Show auto-suggestions' },
    hist: { title: 'Change History', table: 'Table', action: 'Action', user: 'User', time: 'Time', insert: 'Created', update: 'Updated', delete: 'Deleted' },
    backlog: { title: 'Backlog', epics: 'Epics', features: 'Features', stories: 'Stories', addEpic: 'Add Epic', addFeature: 'Add Feature', addStory: 'Add Story', hierarchy: 'Hierarchy View', flat: 'Flat View', filter: 'Filter', all: 'All', unplanned: 'Unplanned' },
    auto: { suggested: 'Suggested', sprint: 'Suggested Sprint', assignee: 'Suggested Assignee', reason: 'Reason', accept: 'Accept', generating: 'Generating...', acGenerated: 'AC generated', storiesGenerated: 'Stories generated' },
    c: { save: 'Save', cancel: 'Cancel', delete: 'Delete', add: 'Add', close: 'Close', total: 'Total', md: 'MD', sp: 'SP', sprint: 'Sprint', team: 'Team', none: 'None', noData: 'No data', loading: 'Loading...', members: 'members', velocity: 'Velocity', ip: 'IP Sprint', synced: 'Synced', type: 'Type', success: 'Success', error: 'Error', warning: 'Warning' },
  },
  pl: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Narzędzie Planowania' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', backlog: 'Backlog', objectives: 'Cele PI', risks: 'ROAM Board', voting: 'Głosowanie', integrations: 'Integracje', reports: 'Raporty', settings: 'Ustawienia', history: 'Historia' },
    auth: { signIn: 'Zaloguj', signUp: 'Rejestracja', signOut: 'Wyloguj', email: 'Email', password: 'Hasło', name: 'Imię i nazwisko', noAccount: 'Nie masz konta?', hasAccount: 'Masz już konto?', demoMode: 'Tryb Demo', configureSupabase: 'Skonfiguruj Supabase w .env' },
    dash: { title: 'Dashboard PI', calDays: 'Dni kalendarzowe', workDays: 'Dni robocze', teamCap: 'Capacity zespołu', allocated: 'Przydzielone', util: 'Wykorzystanie', features: 'Features', risks: 'Otwarte ryzyka', epics: 'Epiki', stories: 'Stories' },
    cap: { title: 'Planowanie Capacity', max: 'Max Capacity', net: 'Capacity netto', abs: 'Nieobecności', warn: 'Uwaga: Ponad 80%', danger: 'Przekroczenie!' },
    board: { title: 'Program Board', addFeat: 'Dodaj Feature', name: 'Nazwa', sp: 'Story Points', bv: 'Wartość biznesowa', status: 'Status', notStarted: 'Nie rozpoczęte', inProgress: 'W trakcie', done: 'Zakończone', blocked: 'Zablokowane', healthy: 'Zdrowa', atRisk: 'Zagrożona', violated: 'Naruszona', miles: 'Kamienie milowe', teams: 'Zespoły', assignee: 'Realizuje', selectTeam: 'Wybierz zespół', selectPerson: 'Wybierz osobę', desc: 'Opis', ac: 'Acceptance Criteria', epic: 'Epic', feature: 'Feature', story: 'Story', parent: 'Rodzic', children: 'Dzieci', generateAC: 'Generuj AC z AI', suggestSprint: 'Sugeruj Sprint', suggestAssignee: 'Sugeruj osobę', breakdownStories: 'Rozbij na Stories', unassigned: 'Nieprzypisane' },
    obj: { title: 'Cele PI', committed: 'Zobowiązane', uncommitted: 'Stretch', add: 'Dodaj cel', predict: 'Miara przewidywalności', target: 'Cel: 80-100%', actual: 'Rzeczywista' },
    risk: { title: 'ROAM Board', resolved: 'Rozwiązane', owned: 'Z właścicielem', accepted: 'Zaakceptowane', mitigated: 'Zmitigowane', add: 'Dodaj ryzyko', owner: 'Właściciel', severity: 'Ważność', high: 'Wysoka', medium: 'Średnia', low: 'Niska', due: 'Termin', feature: 'Powiązany Feature', none: 'Brak ryzyk' },
    vote: { title: 'Głosowanie', fof: 'Fist of Five', start: 'Rozpocznij', end: 'Zakończ', your: 'Twój głos', avg: 'Średnia', dist: 'Rozkład', noVotes: 'Brak głosów', exp: { 5: 'Pełne zaufanie', 4: 'Drobne obawy', 3: 'Neutralny', 2: 'Zastrzeżenia', 1: 'Nie mogę' } },
    int: { title: 'Integracje', jira: 'Jira', azure: 'Azure DevOps', github: 'GitHub', bamboo: 'BambooHR', workday: 'Workday', slack: 'Slack', teams: 'MS Teams', email: 'Email (SMTP)', connected: 'Połączono', disconnected: 'Niepołączono', connect: 'Połącz', disconnect: 'Rozłącz', sync: 'Synchronizuj', lastSync: 'Ostatnia sync', apiUrl: 'URL API', apiKey: 'Klucz API / Token', projectKey: 'Klucz projektu', webhookUrl: 'URL Webhook', syncBacklog: 'Sync Backlog', syncVelocity: 'Sync Velocity', syncPTO: 'Sync PTO/Nieobecności', testConnection: 'Test połączenia', importData: 'Importuj dane', configureAlerts: 'Konfiguruj alerty' },
    alerts: { title: 'Ustawienia alertów', capacityOver: 'Capacity ponad 100%', capacityWarn: 'Capacity ponad 80%', lowConfidence: 'Niski confidence vote (<3)', sprintStart: 'Start sprintu', piStart: 'Przypomnienie o PI Planning', riskHigh: 'Dodano ryzyko o wysokiej ważności', enabled: 'Włączone', threshold: 'Próg', channels: 'Kanały powiadomień' },
    reports: { title: 'Raporty i prognozy', export: 'Eksport', pdf: 'Eksport PDF', csv: 'Eksport CSV', capacityForecast: 'Prognoza Capacity', monteCarlo: 'Symulacja Monte Carlo', simulations: 'Symulacje', confidence: 'Poziom ufności', p50: '50. percentyl', p75: '75. percentyl', p90: '90. percentyl', historicalVelocity: 'Historyczne Velocity', projectedCompletion: 'Prognozowane ukończenie', riskAnalysis: 'Analiza ryzyka', runSimulation: 'Uruchom symulację', generating: 'Generowanie...', iterations: 'iteracji' },
    set: { title: 'Ustawienia', lang: 'Język', editTeams: 'Edytuj zespoły i osoby', addTeam: 'Dodaj zespół', addMember: 'Dodaj osobę', teamName: 'Nazwa zespołu', velocity: 'Velocity', autoFeatures: 'Ustawienia automatyzacji', autoStatus: 'Auto-propagacja statusu', autoSP: 'Auto-agregacja SP', autoSuggest: 'Pokazuj sugestie' },
    hist: { title: 'Historia zmian', table: 'Tabela', action: 'Akcja', user: 'Użytkownik', time: 'Czas', insert: 'Utworzono', update: 'Zaktualizowano', delete: 'Usunięto' },
    backlog: { title: 'Backlog', epics: 'Epiki', features: 'Features', stories: 'Stories', addEpic: 'Dodaj Epic', addFeature: 'Dodaj Feature', addStory: 'Dodaj Story', hierarchy: 'Widok hierarchii', flat: 'Widok płaski', filter: 'Filtruj', all: 'Wszystkie', unplanned: 'Nieplanowane' },
    auto: { suggested: 'Sugerowane', sprint: 'Sugerowany Sprint', assignee: 'Sugerowana osoba', reason: 'Powód', accept: 'Akceptuj', generating: 'Generowanie...', acGenerated: 'AC wygenerowane', storiesGenerated: 'Stories wygenerowane' },
    c: { save: 'Zapisz', cancel: 'Anuluj', delete: 'Usuń', add: 'Dodaj', close: 'Zamknij', total: 'Suma', md: 'MD', sp: 'SP', sprint: 'Sprint', team: 'Zespół', none: 'Brak', noData: 'Brak danych', loading: 'Ładowanie...', members: 'członków', velocity: 'Velocity', ip: 'IP Sprint', synced: 'Zsynchronizowano', type: 'Typ', success: 'Sukces', error: 'Błąd', warning: 'Ostrzeżenie' },
  },
};

const HOLIDAYS = ['2025-01-01','2025-01-06','2025-04-20','2025-04-21','2025-05-01','2025-05-03','2025-06-08','2025-06-19','2025-08-15','2025-11-01','2025-11-11','2025-12-25','2025-12-26'];
const PI_PRESETS = { PI43: { s: '2025-01-08', e: '2025-02-18' }, PI44: { s: '2025-02-19', e: '2025-04-29' }, PI45: { s: '2025-04-30', e: '2025-07-08' }, PI46: { s: '2025-07-09', e: '2025-09-16' }, PI47: { s: '2025-09-17', e: '2025-11-25' }, PI48: { s: '2025-11-26', e: '2026-02-03' } };

const uid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
const pd = (s) => new Date(s + 'T00:00:00');
const fd = (d) => d.toISOString().split('T')[0];
const isWknd = (d) => d.getDay() === 0 || d.getDay() === 6;
const isHol = (d) => HOLIDAYS.includes(fd(d));
const getWorkDays = (s, e) => { let c = 0; const cur = new Date(s); while (cur <= e) { if (!isWknd(cur) && !isHol(cur)) c++; cur.setDate(cur.getDate() + 1); } return c; };
const addWorkDays = (s, days) => { const r = new Date(s); let a = 0; while (a < days) { r.setDate(r.getDate() + 1); if (!isWknd(r) && !isHol(r)) a++; } return r; };
const calcSprints = (piStart, len, cnt) => { const sprints = []; let cur = new Date(piStart); for (let i = 0; i < cnt; i++) { const end = addWorkDays(cur, len - 1); sprints.push({ num: i + 1, start: new Date(cur), end, netDays: getWorkDays(cur, end), isIP: i === cnt - 1 }); cur = new Date(end); cur.setDate(cur.getDate() + 1); while (isWknd(cur)) cur.setDate(cur.getDate() + 1); } return sprints; };
const healthColor = (p) => p <= 80 ? 'emerald' : p <= 100 ? 'amber' : 'red';
const depHealth = (pS, cS) => pS < cS ? 'healthy' : pS === cS ? 'atRisk' : 'violated';

// Demo data
const demoTeams = [
  { id: 'team1', name: 'Team Alpha', color: '#22d3ee', velocity: 40, historicalVelocity: [38, 42, 40, 35, 44, 41], team_members: [{ id: 't1m1', name: 'Anna Kowalska', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m2', name: 'Jan Nowak', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m3', name: 'Maria Wiśniewska', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m4', name: 'Piotr Zieliński', fte: 1, role: 'QA', team_id: 'team1' }] },
  { id: 'team2', name: 'Team Beta', color: '#34d399', velocity: 35, historicalVelocity: [32, 36, 34, 38, 33, 35], team_members: [{ id: 't2m1', name: 'Katarzyna Lewandowska', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m2', name: 'Tomasz Wójcik', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m3', name: 'Agnieszka Kamińska', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m4', name: 'Michał Szymański', fte: 1, role: 'QA', team_id: 'team2' }] },
];
const demoItems = [
  { id: 'e1', type: 'epic', name: 'User Management Platform', description: 'Complete user management system', story_points: 0, team_id: null, assignee_id: null, sprint: null, status: 'inProgress', business_value: 9, parent_id: null, acceptance_criteria: '- Users can register\n- Profile management\n- RBAC' },
  { id: 'f1', type: 'feature', name: 'User Authentication', description: 'OAuth2 and email auth', story_points: 40, team_id: 'team1', assignee_id: 't1m1', sprint: 1, status: 'inProgress', business_value: 8, parent_id: 'e1', acceptance_criteria: '- OAuth2\n- Email verify\n- Password reset' },
  { id: 'f2', type: 'feature', name: 'Profile Management', description: 'Profile CRUD', story_points: 20, team_id: 'team1', assignee_id: 't1m2', sprint: 2, status: 'notStarted', business_value: 7, parent_id: 'e1', acceptance_criteria: '' },
  { id: 'f3', type: 'feature', name: 'API Integration', description: 'RESTful API', story_points: 40, team_id: 'team2', assignee_id: 't2m1', sprint: 1, status: 'inProgress', business_value: 9, parent_id: null, acceptance_criteria: '' },
  { id: 's1', type: 'story', name: 'OAuth2 flow', description: '', story_points: 8, team_id: 'team1', assignee_id: 't1m1', sprint: 1, status: 'inProgress', business_value: 8, parent_id: 'f1', acceptance_criteria: '' },
  { id: 's2', type: 'story', name: 'Email verification', description: '', story_points: 5, team_id: 'team1', assignee_id: 't1m3', sprint: 1, status: 'notStarted', business_value: 7, parent_id: 'f1', acceptance_criteria: '' },
];
const demoDeps = [{ id: 'd1', provider_id: 'f3', consumer_id: 'f1', provider_sprint: 1, consumer_sprint: 2 }];
const demoObjectives = [{ id: 'o1', name: 'Deliver core auth', committed: true, business_value: 9, planned_value: 9, actual_value: null, status: 'inProgress', team_id: 'team1' }];
const demoRisks = [{ id: 'r1', name: 'API rate limits', status: 'owned', severity: 'medium', owner_id: 't2m1', due_date: '2025-03-15', feature_id: 'f3' }];
const demoMilestones = [{ id: 'm1', name: 'MVP Release', sprint: 3, color: '#f59e0b' }, { id: 'm2', name: 'Beta Launch', sprint: 5, color: '#8b5cf6' }];

// ============ INTEGRATION ENGINE ============
const IntegrationEngine = {
  // Mock API calls - in production these would be real API calls
  jira: {
    test: async (config) => { await new Promise(r => setTimeout(r, 1000)); return { success: true, message: 'Connected to Jira' }; },
    syncBacklog: async (config) => {
      await new Promise(r => setTimeout(r, 1500));
      return { 
        success: true, 
        items: [
          { key: 'PROJ-101', type: 'Story', summary: 'Imported from Jira', points: 5 },
          { key: 'PROJ-102', type: 'Story', summary: 'Another Jira item', points: 8 },
        ]
      };
    },
    syncVelocity: async (config) => {
      await new Promise(r => setTimeout(r, 1000));
      return { success: true, velocity: [38, 42, 40, 35, 44, 41] };
    }
  },
  azure: {
    test: async (config) => { await new Promise(r => setTimeout(r, 1000)); return { success: true, message: 'Connected to Azure DevOps' }; },
    syncBacklog: async (config) => {
      await new Promise(r => setTimeout(r, 1500));
      return { success: true, items: [{ id: 12345, type: 'User Story', title: 'Azure work item', effort: 5 }] };
    }
  },
  bamboo: {
    test: async (config) => { await new Promise(r => setTimeout(r, 1000)); return { success: true, message: 'Connected to BambooHR' }; },
    syncPTO: async (config) => {
      await new Promise(r => setTimeout(r, 1500));
      return { 
        success: true, 
        absences: [
          { employeeId: '001', name: 'Anna Kowalska', startDate: '2025-03-10', endDate: '2025-03-14', type: 'PTO' },
          { employeeId: '002', name: 'Jan Nowak', startDate: '2025-03-20', endDate: '2025-03-21', type: 'PTO' },
        ]
      };
    }
  }
};

// ============ ALERT ENGINE ============
const AlertEngine = {
  checkAlerts: (data, alertConfig, notifications) => {
    const alerts = [];
    const { teams, items, voting, sprints, pi } = data;
    
    // Check capacity alerts
    if (alertConfig.capacityOver || alertConfig.capacityWarn) {
      teams.forEach(team => {
        const teamItems = items.filter(i => i.team_id === team.id && i.type !== 'epic');
        const totalSP = teamItems.reduce((sum, i) => sum + (i.story_points || 0), 0);
        const maxSP = team.velocity * 5;
        const utilization = (totalSP / maxSP) * 100;
        
        if (alertConfig.capacityOver && utilization > 100) {
          alerts.push({ type: 'danger', title: `${team.name}: Capacity exceeded`, message: `${utilization.toFixed(0)}% utilization (${totalSP}/${maxSP} SP)` });
        } else if (alertConfig.capacityWarn && utilization > 80 && utilization <= 100) {
          alerts.push({ type: 'warning', title: `${team.name}: High capacity`, message: `${utilization.toFixed(0)}% utilization` });
        }
      });
    }
    
    // Check voting alerts
    if (alertConfig.lowConfidence && voting?.votes) {
      const avg = Object.values(voting.votes).reduce((a, b) => a + b, 0) / Object.values(voting.votes).length;
      if (avg < 3) {
        alerts.push({ type: 'warning', title: 'Low confidence vote', message: `Average: ${avg.toFixed(1)}/5` });
      }
    }
    
    return alerts;
  },
  
  sendNotification: async (channel, config, alert) => {
    // Mock notification sending
    console.log(`Sending ${channel} notification:`, alert);
    if (channel === 'slack' && config.webhookUrl) {
      // In production: fetch(config.webhookUrl, { method: 'POST', body: JSON.stringify({ text: alert.message }) })
    }
    return { success: true };
  }
};

// ============ MONTE CARLO ENGINE ============
const MonteCarloEngine = {
  runSimulation: (teams, items, iterations = 10000) => {
    const features = items.filter(i => i.type === 'feature' && i.status !== 'done');
    const totalSP = features.reduce((sum, f) => sum + (f.story_points || 0), 0);
    
    // Calculate velocity statistics per team
    const teamStats = teams.map(team => {
      const velocities = team.historicalVelocity || [team.velocity];
      const mean = velocities.reduce((a, b) => a + b, 0) / velocities.length;
      const variance = velocities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / velocities.length;
      const stdDev = Math.sqrt(variance);
      return { teamId: team.id, mean, stdDev };
    });
    
    const totalMeanVelocity = teamStats.reduce((sum, t) => sum + t.mean, 0);
    const totalStdDev = Math.sqrt(teamStats.reduce((sum, t) => sum + Math.pow(t.stdDev, 2), 0));
    
    // Run simulations
    const results = [];
    for (let i = 0; i < iterations; i++) {
      // Generate random velocity using normal distribution (Box-Muller)
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const simulatedVelocity = Math.max(totalMeanVelocity + z * totalStdDev, totalMeanVelocity * 0.5);
      
      // Calculate sprints needed
      const sprintsNeeded = Math.ceil(totalSP / simulatedVelocity);
      results.push(sprintsNeeded);
    }
    
    // Sort results for percentile calculation
    results.sort((a, b) => a - b);
    
    return {
      totalSP,
      meanVelocity: totalMeanVelocity,
      stdDev: totalStdDev,
      p50: results[Math.floor(iterations * 0.5)],
      p75: results[Math.floor(iterations * 0.75)],
      p90: results[Math.floor(iterations * 0.90)],
      p95: results[Math.floor(iterations * 0.95)],
      min: results[0],
      max: results[results.length - 1],
      histogram: MonteCarloEngine.createHistogram(results)
    };
  },
  
  createHistogram: (results) => {
    const min = Math.min(...results);
    const max = Math.max(...results);
    const bucketCount = Math.min(max - min + 1, 20);
    const bucketSize = (max - min + 1) / bucketCount;
    const buckets = Array(bucketCount).fill(0);
    
    results.forEach(r => {
      const bucket = Math.min(Math.floor((r - min) / bucketSize), bucketCount - 1);
      buckets[bucket]++;
    });
    
    return buckets.map((count, i) => ({
      sprints: Math.round(min + i * bucketSize),
      count,
      percentage: (count / results.length) * 100
    }));
  },
  
  generateCSV: (data) => {
    const { teams, items, simulation } = data;
    let csv = 'Report Type,Metric,Value\n';
    csv += `Monte Carlo,Total SP,${simulation.totalSP}\n`;
    csv += `Monte Carlo,Mean Velocity,${simulation.meanVelocity.toFixed(1)}\n`;
    csv += `Monte Carlo,P50 Sprints,${simulation.p50}\n`;
    csv += `Monte Carlo,P75 Sprints,${simulation.p75}\n`;
    csv += `Monte Carlo,P90 Sprints,${simulation.p90}\n`;
    csv += '\nTeam,Velocity,Total SP,Utilization\n';
    teams.forEach(team => {
      const teamSP = items.filter(i => i.team_id === team.id).reduce((s, i) => s + (i.story_points || 0), 0);
      csv += `${team.name},${team.velocity},${teamSP},${((teamSP / (team.velocity * 5)) * 100).toFixed(1)}%\n`;
    });
    return csv;
  }
};

// ============ AUTOMATION ENGINE ============
const AutomationEngine = {
  calculateParentStatus: (children) => {
    if (!children.length) return 'notStarted';
    const statuses = children.map(c => c.status);
    if (statuses.includes('blocked')) return 'blocked';
    if (statuses.every(s => s === 'done')) return 'done';
    if (statuses.some(s => s === 'inProgress' || s === 'done')) return 'inProgress';
    return 'notStarted';
  },
  calculateParentSP: (children) => children.reduce((sum, c) => sum + (c.story_points || 0), 0),
  suggestSprint: (item, items, teams, deps, sprints, absences) => {
    const team = teams.find(t => t.id === item.team_id);
    if (!team) return { sprint: 1, reason: 'No team' };
    const consumingDeps = deps.filter(d => d.consumer_id === item.id);
    let minSprint = 1;
    consumingDeps.forEach(dep => { const provider = items.find(i => i.id === dep.provider_id); if (provider?.sprint) minSprint = Math.max(minSprint, provider.sprint + 1); });
    return { sprint: minSprint, reason: `After dependencies` };
  },
  suggestAssignee: (item, items, teams, absences, sprints) => {
    const team = teams.find(t => t.id === item.team_id);
    if (!team?.team_members?.length) return { assignee: null, reason: 'No members' };
    const devs = team.team_members.filter(m => m.role === 'Developer');
    if (devs.length) return { assignee: devs[0].id, name: devs[0].name, reason: 'First available' };
    return { assignee: team.team_members[0].id, name: team.team_members[0].name, reason: 'Default' };
  },
  generateAcceptanceCriteria: async (item) => {
    await new Promise(r => setTimeout(r, 500));
    return '- Feature works as expected\n- Error handling in place\n- Tests pass\n- Documentation updated';
  },
  generateStoryBreakdown: async (feature) => {
    await new Promise(r => setTimeout(r, 800));
    return [
      { name: `${feature.name} - Backend`, sp: Math.ceil(feature.story_points * 0.4) },
      { name: `${feature.name} - Frontend`, sp: Math.ceil(feature.story_points * 0.4) },
      { name: `${feature.name} - Tests`, sp: Math.ceil(feature.story_points * 0.2) },
    ];
  }
};

// Components
const Badge = ({ children, v = 'default', s = 'sm' }) => {
  const vars = { default: 'bg-slate-700 text-slate-300', success: 'bg-emerald-500/20 text-emerald-400', warning: 'bg-amber-500/20 text-amber-400', danger: 'bg-red-500/20 text-red-400', info: 'bg-cyan-500/20 text-cyan-400', purple: 'bg-purple-500/20 text-purple-400' };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center rounded-full font-medium ${vars[v]} ${sizes[s]}`}>{children}</span>;
};

const Icon = ({ name, className = 'w-5 h-5' }) => {
  const paths = { dash: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', cap: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', board: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2', target: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', risk: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', vote: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11', settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', history: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', plus: 'M12 4v16m8-8H4', x: 'M6 18L18 6M6 6l12 12', check: 'M5 13l4 4L19 7', user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', list: 'M4 6h16M4 10h16M4 14h16M4 18h16', folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', spark: 'M13 10V3L4 14h7v7l9-11h-7z', link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', chevDown: 'M19 9l-7 7-7-7', chevRight: 'M9 5l7 7-7 7', download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', plug: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' };
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name]} /></svg>;
};

const Stat = ({ label, value, color = 'cyan' }) => {
  const colors = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400', purple: 'text-purple-400' };
  return <div className={`glass rounded-xl p-4 ${colors[color]}`}><p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p><p className="text-2xl font-bold font-mono">{value}</p></div>;
};

const Bar = ({ val, max, h = 'h-2' }) => {
  const pct = Math.min((val / max) * 100, 100); const over = val > max;
  return <div className="w-full"><div className={`w-full bg-slate-800 rounded-full overflow-hidden ${h}`}><div className={`${h} ${over ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'} rounded-full`} style={{ width: `${Math.min(pct, 100)}%` }} /></div><div className="flex justify-between mt-1 text-xs"><span className={over ? 'text-red-400' : 'text-slate-400'}>{val}/{max}</span><span className={over ? 'text-red-400' : 'text-slate-500'}>{pct.toFixed(0)}%</span></div></div>;
};

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} /><div className={`relative glass rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}><div className="flex items-center justify-between p-4 border-b border-slate-700"><h3 className="text-lg font-semibold text-white">{title}</h3><button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg"><Icon name="x" /></button></div><div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div></div></div>;
};

const Input = ({ label, ...props }) => <div><label className="block text-xs uppercase text-slate-400 mb-2">{label}</label><input {...props} className="w-full px-4 py-2 rounded-lg input-field text-white" /></div>;
const TextArea = ({ label, ...props }) => <div><label className="block text-xs uppercase text-slate-400 mb-2">{label}</label><textarea {...props} className="w-full px-4 py-2 rounded-lg input-field text-white resize-none" /></div>;
const Select = ({ label, children, ...props }) => <div><label className="block text-xs uppercase text-slate-400 mb-2">{label}</label><select {...props} className="w-full px-4 py-2 rounded-lg input-field text-white">{children}</select></div>;
const TypeBadge = ({ type }) => { const c = { epic: { color: 'purple', label: 'Epic' }, feature: { color: 'info', label: 'Feature' }, story: { color: 'success', label: 'Story' } }[type] || { color: 'default', label: type }; return <Badge v={c.color} s="xs">{c.label}</Badge>; };

// Auth Screen
const AuthScreen = ({ onAuth, onDemo }) => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const t = T[lang].auth;
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { const res = mode === 'signin' ? await auth.signIn(email, password) : await auth.signUp(email, password, name); if (res.error) setError(res.error.message); else if (res.data?.user) onAuth(res.data.user, res.data.session); } catch (err) { setError(err.message); } setLoading(false); };
  return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><style>{`.glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.1); } .input-field { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); } .input-field:focus { border-color: rgba(34, 211, 238, 0.5); outline: none; } .btn-primary { background: linear-gradient(135deg, #22d3ee, #34d399); }`}</style><div className="glass rounded-2xl p-8 w-full max-w-md" style={{ fontFamily: 'Inter, sans-serif' }}><div className="flex items-center justify-center gap-3 mb-6"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center"><span className="text-2xl font-bold text-white">π</span></div><div><h1 className="text-xl font-bold text-white">PI Capacity Planner</h1><p className="text-xs text-slate-400">SAFe 6.0</p></div></div><div className="flex gap-2 mb-4 justify-center"><button onClick={() => setLang('en')} className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>EN</button><button onClick={() => setLang('pl')} className={`px-3 py-1 rounded text-sm ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>PL</button></div>{!isConfigured() && <div className="mb-4 p-3 rounded-lg bg-amber-500/20 text-amber-300 text-sm text-center">{t.configureSupabase}</div>}<form onSubmit={handleSubmit} className="space-y-4">{mode === 'signup' && <Input label={t.name} type="text" value={name} onChange={e => setName(e.target.value)} required />}<Input label={t.email} type="email" value={email} onChange={e => setEmail(e.target.value)} required /><Input label={t.password} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />{error && <p className="text-red-400 text-sm">{error}</p>}<button type="submit" disabled={loading || !isConfigured()} className="w-full btn-primary text-white font-semibold py-3 rounded-lg disabled:opacity-50">{loading ? '...' : mode === 'signin' ? t.signIn : t.signUp}</button></form><p className="text-center text-slate-400 text-sm mt-4">{mode === 'signin' ? t.noAccount : t.hasAccount}{' '}<button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-cyan-400 hover:underline">{mode === 'signin' ? t.signUp : t.signIn}</button></p><div className="mt-6 pt-4 border-t border-slate-700"><button onClick={onDemo} className="w-full py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm">{t.demoMode}</button></div></div></div>;
};

// Dashboard
const Dashboard = () => {
  const { t, teams, items, risks, sprints, piSum, pi, alerts } = useApp();
  const epics = items.filter(i => i.type === 'epic');
  const features = items.filter(i => i.type === 'feature');
  const stories = items.filter(i => i.type === 'story');
  const openRisks = risks.filter(r => r.status !== 'resolved').length;
  
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.dash.title} — {pi}</h2>
    
    {alerts.length > 0 && (
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className={`p-4 rounded-lg flex items-center gap-3 ${alert.type === 'danger' ? 'bg-red-500/20 border border-red-500/50' : 'bg-amber-500/20 border border-amber-500/50'}`}>
            <Icon name="bell" className={alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'} />
            <div>
              <p className={`font-medium ${alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{alert.title}</p>
              <p className="text-sm text-slate-300">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    )}
    
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Stat label={t.dash.calDays} value={piSum.calDays} />
      <Stat label={t.dash.workDays} value={piSum.workDays} color="emerald" />
      <Stat label={t.dash.epics} value={epics.length} color="purple" />
      <Stat label={t.dash.features} value={features.length} color="cyan" />
      <Stat label={t.dash.stories} value={stories.length} color="emerald" />
      <Stat label={t.dash.risks} value={openRisks} color={openRisks > 3 ? 'red' : 'emerald'} />
    </div>
    
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.c.team}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(tm => {
          const tmSP = features.filter(f => f.team_id === tm.id).reduce((s, f) => s + (f.story_points || 0), 0);
          const util = (tmSP / (tm.velocity * 5)) * 100;
          return <div key={tm.id} className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: tm.color }} /><span className="font-medium text-white">{tm.name}</span></div>
              <Badge v={util > 100 ? 'danger' : util > 80 ? 'warning' : 'success'}>{tmSP} SP</Badge>
            </div>
            <Bar val={tmSP} max={tm.velocity * 5} />
          </div>;
        })}
      </div>
    </div>
  </div>;
};

// Integrations View
const Integrations = () => {
  const { t, integrations, setIntegrations, alertConfig, setAlertConfig, teams, setTeams } = useApp();
  const [testing, setTesting] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [message, setMessage] = useState(null);

  const integrationTypes = [
    { id: 'jira', name: t.int.jira, icon: '🔷', category: 'backlog', features: ['syncBacklog', 'syncVelocity'] },
    { id: 'azure', name: t.int.azure, icon: '🔶', category: 'backlog', features: ['syncBacklog', 'syncVelocity'] },
    { id: 'bamboo', name: t.int.bamboo, icon: '🌿', category: 'hr', features: ['syncPTO'] },
    { id: 'workday', name: t.int.workday, icon: '📊', category: 'hr', features: ['syncPTO'] },
  ];
  
  const notificationChannels = [
    { id: 'slack', name: t.int.slack, icon: '💬' },
    { id: 'teams', name: t.int.teams, icon: '👥' },
    { id: 'email', name: t.int.email, icon: '📧' },
  ];

  const testConnection = async (type) => {
    setTesting(type);
    const config = integrations[type];
    const engine = IntegrationEngine[type];
    if (engine?.test) {
      const result = await engine.test(config);
      setMessage({ type: result.success ? 'success' : 'error', text: result.message });
      if (result.success) {
        setIntegrations({ ...integrations, [type]: { ...config, connected: true, lastSync: new Date().toISOString() } });
      }
    }
    setTesting(null);
  };

  const syncData = async (type, syncType) => {
    setSyncing(`${type}-${syncType}`);
    const config = integrations[type];
    const engine = IntegrationEngine[type];
    if (engine?.[syncType]) {
      const result = await engine[syncType](config);
      if (result.success) {
        setMessage({ type: 'success', text: `Synced ${result.items?.length || result.absences?.length || 0} items` });
        if (syncType === 'syncVelocity' && result.velocity) {
          setTeams(teams.map(tm => ({ ...tm, historicalVelocity: result.velocity })));
        }
      }
    }
    setSyncing(null);
  };

  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Icon name="plug" /> {t.int.title}</h2>
    
    {message && (
      <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
        {message.text}
        <button onClick={() => setMessage(null)} className="float-right">×</button>
      </div>
    )}

    <div className="grid md:grid-cols-2 gap-6">
      {/* Backlog Integrations */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">📋 Backlog & Velocity</h3>
        <div className="space-y-4">
          {integrationTypes.filter(i => i.category === 'backlog').map(int => {
            const config = integrations[int.id] || {};
            return <div key={int.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{int.icon}</span>
                  <span className="font-medium text-white">{int.name}</span>
                </div>
                <Badge v={config.connected ? 'success' : 'default'}>{config.connected ? t.int.connected : t.int.disconnected}</Badge>
              </div>
              <div className="space-y-2">
                <Input label={t.int.apiUrl} value={config.apiUrl || ''} onChange={e => setIntegrations({ ...integrations, [int.id]: { ...config, apiUrl: e.target.value } })} placeholder="https://your-instance.atlassian.net" />
                <Input label={t.int.apiKey} type="password" value={config.apiKey || ''} onChange={e => setIntegrations({ ...integrations, [int.id]: { ...config, apiKey: e.target.value } })} placeholder="API Token" />
                <Input label={t.int.projectKey} value={config.projectKey || ''} onChange={e => setIntegrations({ ...integrations, [int.id]: { ...config, projectKey: e.target.value } })} placeholder="PROJ" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => testConnection(int.id)} disabled={testing === int.id} className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                  {testing === int.id ? '...' : <><Icon name="plug" className="w-3 h-3" /> {t.int.testConnection}</>}
                </button>
                {config.connected && (
                  <>
                    <button onClick={() => syncData(int.id, 'syncBacklog')} disabled={syncing === `${int.id}-syncBacklog`} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                      <Icon name="refresh" className="w-3 h-3" /> {t.int.syncBacklog}
                    </button>
                    <button onClick={() => syncData(int.id, 'syncVelocity')} disabled={syncing === `${int.id}-syncVelocity`} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                      <Icon name="chart" className="w-3 h-3" /> {t.int.syncVelocity}
                    </button>
                  </>
                )}
              </div>
              {config.lastSync && <p className="text-xs text-slate-500 mt-2">{t.int.lastSync}: {new Date(config.lastSync).toLocaleString()}</p>}
            </div>;
          })}
        </div>
      </div>

      {/* HR/PTO Integrations */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">👥 HR & PTO</h3>
        <div className="space-y-4">
          {integrationTypes.filter(i => i.category === 'hr').map(int => {
            const config = integrations[int.id] || {};
            return <div key={int.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{int.icon}</span>
                  <span className="font-medium text-white">{int.name}</span>
                </div>
                <Badge v={config.connected ? 'success' : 'default'}>{config.connected ? t.int.connected : t.int.disconnected}</Badge>
              </div>
              <div className="space-y-2">
                <Input label={t.int.apiUrl} value={config.apiUrl || ''} onChange={e => setIntegrations({ ...integrations, [int.id]: { ...config, apiUrl: e.target.value } })} placeholder="https://api.bamboohr.com" />
                <Input label={t.int.apiKey} type="password" value={config.apiKey || ''} onChange={e => setIntegrations({ ...integrations, [int.id]: { ...config, apiKey: e.target.value } })} />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => testConnection(int.id)} disabled={testing === int.id} className="btn-secondary px-3 py-1.5 rounded-lg text-xs">{testing === int.id ? '...' : t.int.testConnection}</button>
                {config.connected && (
                  <button onClick={() => syncData(int.id, 'syncPTO')} disabled={syncing === `${int.id}-syncPTO`} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                    <Icon name="refresh" className="w-3 h-3" /> {t.int.syncPTO}
                  </button>
                )}
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>

    {/* Notification Channels */}
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Icon name="bell" /> {t.int.configureAlerts}</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {notificationChannels.map(ch => {
          const config = integrations[ch.id] || {};
          return <div key={ch.id} className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{ch.icon}</span>
              <span className="font-medium text-white">{ch.name}</span>
              <input type="checkbox" checked={config.enabled || false} onChange={e => setIntegrations({ ...integrations, [ch.id]: { ...config, enabled: e.target.checked } })} className="ml-auto" />
            </div>
            <Input label={t.int.webhookUrl} value={config.webhookUrl || ''} onChange={e => setIntegrations({ ...integrations, [ch.id]: { ...config, webhookUrl: e.target.value } })} placeholder={ch.id === 'email' ? 'smtp://...' : 'https://hooks...'} />
          </div>;
        })}
      </div>

      <h4 className="font-medium text-white mb-3">{t.alerts.title}</h4>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { key: 'capacityOver', label: t.alerts.capacityOver },
          { key: 'capacityWarn', label: t.alerts.capacityWarn },
          { key: 'lowConfidence', label: t.alerts.lowConfidence },
          { key: 'sprintStart', label: t.alerts.sprintStart },
          { key: 'piStart', label: t.alerts.piStart },
          { key: 'riskHigh', label: t.alerts.riskHigh },
        ].map(alert => (
          <label key={alert.key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 cursor-pointer">
            <input type="checkbox" checked={alertConfig[alert.key] || false} onChange={e => setAlertConfig({ ...alertConfig, [alert.key]: e.target.checked })} />
            <span className="text-slate-300">{alert.label}</span>
          </label>
        ))}
      </div>
    </div>
  </div>;
};

// Reports View with Monte Carlo
const Reports = () => {
  const { t, teams, items, pi, sprints } = useApp();
  const [simulation, setSimulation] = useState(null);
  const [running, setRunning] = useState(false);
  const [iterations, setIterations] = useState(10000);

  const features = items.filter(i => i.type === 'feature');
  const totalSP = features.reduce((sum, f) => sum + (f.story_points || 0), 0);
  const doneSP = features.filter(f => f.status === 'done').reduce((sum, f) => sum + (f.story_points || 0), 0);

  const runSimulation = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 100));
    const result = MonteCarloEngine.runSimulation(teams, items, iterations);
    setSimulation(result);
    setRunning(false);
  };

  const exportCSV = () => {
    if (!simulation) return;
    const csv = MonteCarloEngine.generateCSV({ teams, items, simulation });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity-report-${pi}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportPDF = () => {
    // In production: use jspdf library
    alert('PDF export would generate a professional report with charts and Monte Carlo results');
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Icon name="chart" /> {t.reports.title}</h2>
      <div className="flex gap-2">
        <button onClick={exportCSV} disabled={!simulation} className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="download" className="w-4 h-4" /> {t.reports.csv}</button>
        <button onClick={exportPDF} disabled={!simulation} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="download" className="w-4 h-4" /> {t.reports.pdf}</button>
      </div>
    </div>

    {/* Current Status */}
    <div className="grid md:grid-cols-4 gap-4">
      <Stat label="Total SP" value={totalSP} />
      <Stat label="Done SP" value={doneSP} color="emerald" />
      <Stat label="Remaining SP" value={totalSP - doneSP} color="amber" />
      <Stat label="Progress" value={`${totalSP > 0 ? ((doneSP / totalSP) * 100).toFixed(0) : 0}%`} color="purple" />
    </div>

    {/* Historical Velocity */}
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">{t.reports.historicalVelocity}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(team => (
          <div key={team.id} className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: team.color }} />
              <span className="font-medium text-white">{team.name}</span>
            </div>
            <div className="flex gap-1 h-16 items-end">
              {(team.historicalVelocity || [team.velocity]).map((v, i) => {
                const max = Math.max(...(team.historicalVelocity || [team.velocity]));
                return <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-emerald-500 rounded-t" style={{ height: `${(v / max) * 100}%` }} title={`Sprint ${i + 1}: ${v} SP`} />;
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Avg: {((team.historicalVelocity || [team.velocity]).reduce((a, b) => a + b, 0) / (team.historicalVelocity || [team.velocity]).length).toFixed(1)} SP</span>
              <span>Current: {team.velocity} SP</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Monte Carlo Simulation */}
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{t.reports.monteCarlo}</h3>
        <div className="flex items-center gap-3">
          <select value={iterations} onChange={e => setIterations(parseInt(e.target.value))} className="px-3 py-1.5 rounded-lg input-field text-white text-sm">
            <option value={1000}>1,000 {t.reports.iterations}</option>
            <option value={10000}>10,000 {t.reports.iterations}</option>
            <option value={50000}>50,000 {t.reports.iterations}</option>
          </select>
          <button onClick={runSimulation} disabled={running} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Icon name="spark" className="w-4 h-4" /> {running ? t.reports.generating : t.reports.runSimulation}
          </button>
        </div>
      </div>

      {simulation ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-emerald-400 uppercase">{t.reports.p50}</p>
              <p className="text-2xl font-bold text-emerald-400">{simulation.p50} sprints</p>
              <p className="text-xs text-slate-400">50% chance to complete</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-xs text-amber-400 uppercase">{t.reports.p75}</p>
              <p className="text-2xl font-bold text-amber-400">{simulation.p75} sprints</p>
              <p className="text-xs text-slate-400">75% chance to complete</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-red-400 uppercase">{t.reports.p90}</p>
              <p className="text-2xl font-bold text-red-400">{simulation.p90} sprints</p>
              <p className="text-xs text-slate-400">90% chance to complete</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <p className="text-xs text-purple-400 uppercase">Range</p>
              <p className="text-2xl font-bold text-purple-400">{simulation.min}-{simulation.max}</p>
              <p className="text-xs text-slate-400">Min-Max sprints</p>
            </div>
          </div>

          {/* Histogram */}
          <div>
            <h4 className="text-sm text-slate-400 mb-3">Distribution of completion times</h4>
            <div className="flex gap-1 h-32 items-end">
              {simulation.histogram.map((bucket, i) => (
                <div key={i} className="flex-1 group relative">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-emerald-500 rounded-t transition-all hover:from-cyan-400 hover:to-emerald-400" 
                    style={{ height: `${bucket.percentage * 3}%` }} 
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 px-2 py-1 rounded text-xs whitespace-nowrap">
                    {bucket.sprints} sprints: {bucket.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>{simulation.min} sprints</span>
              <span>{simulation.max} sprints</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/50 text-sm text-slate-300">
            <p><strong>Summary:</strong> Based on {iterations.toLocaleString()} simulations with historical velocity data:</p>
            <ul className="mt-2 space-y-1 text-slate-400">
              <li>• There's a 50% chance of completing {simulation.totalSP} SP in {simulation.p50} sprints or less</li>
              <li>• For 90% confidence, plan for {simulation.p90} sprints</li>
              <li>• Mean velocity: {simulation.meanVelocity.toFixed(1)} SP/sprint (σ = {simulation.stdDev.toFixed(1)})</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <Icon name="chart" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Click "Run Simulation" to generate Monte Carlo forecast</p>
        </div>
      )}
    </div>

    {/* Capacity Forecast */}
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">{t.reports.capacityForecast}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th className="px-4 py-2 text-left">PI</th>
              <th className="px-4 py-2 text-center">Team Capacity (SP)</th>
              <th className="px-4 py-2 text-center">Projected Load</th>
              <th className="px-4 py-2 text-center">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Object.keys(PI_PRESETS).slice(0, 4).map((piName, idx) => {
              const totalCap = teams.reduce((sum, t) => sum + t.velocity * 5, 0);
              const load = idx === 0 ? totalSP : Math.round(totalSP * (0.7 + Math.random() * 0.3));
              const util = (load / totalCap) * 100;
              return <tr key={piName}>
                <td className="px-4 py-3"><Badge v={piName === pi ? 'info' : 'default'}>{piName}</Badge></td>
                <td className="px-4 py-3 text-center text-white">{totalCap}</td>
                <td className="px-4 py-3 text-center"><span className={util > 100 ? 'text-red-400' : util > 80 ? 'text-amber-400' : 'text-emerald-400'}>{load}</span></td>
                <td className="px-4 py-3 text-center"><span className={totalCap - load < 0 ? 'text-red-400' : 'text-emerald-400'}>{totalCap - load}</span></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
};

// Simplified other views for space - keeping core functionality
const Capacity = () => {
  const { t, teams, sprints, absences, updateAbsence, items } = useApp();
  const [selTeam, setSelTeam] = useState(teams[0]?.id);
  const team = teams.find(tm => tm.id === selTeam);
  const members = team?.team_members || [];
  const features = items.filter(i => i.type !== 'epic');
  if (!team) return null;

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.cap.title}</h2>
      <div className="flex gap-2">{teams.map(tm => <button key={tm.id} onClick={() => setSelTeam(tm.id)} className={`px-4 py-2 rounded-lg text-sm ${selTeam === tm.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>{tm.name}</button>)}</div>
    </div>
    <div className="glass rounded-xl overflow-hidden">
      <table className="w-full">
        <thead><tr className="bg-slate-900/40 text-xs uppercase text-slate-400"><th className="px-4 py-3 text-left">Member</th>{[1,2,3,4,5].map(s => <th key={s} className="px-4 py-3 text-center">S{s}</th>)}<th className="px-4 py-3 text-center">{t.c.total}</th></tr></thead>
        <tbody className="divide-y divide-slate-800">
          {members.map(m => { 
            const tot = [1,2,3,4,5].reduce((sum, sn) => sum + (absences[`${selTeam}-${m.id}-${sn}`] || 0), 0); 
            return <tr key={m.id}>
              <td className="px-4 py-3 text-white">{m.name}</td>
              {[1,2,3,4,5].map(sn => <td key={sn} className="px-4 py-2 text-center"><input type="number" value={absences[`${selTeam}-${m.id}-${sn}`] || 0} onChange={e => updateAbsence(selTeam, m.id, sn, parseInt(e.target.value) || 0)} className="w-14 px-2 py-1.5 rounded input-field text-white text-center text-sm" min="0" max="10" /></td>)}
              <td className="px-4 py-3 text-center"><Badge v="warning">{tot}</Badge></td>
            </tr>; 
          })}
        </tbody>
      </table>
    </div>
  </div>;
};

const Backlog = () => {
  const { t, items, teams, allMembers, addItem, updateItem, deleteItem } = useApp();
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(null);
  const epics = items.filter(i => i.type === 'epic');
  const features = items.filter(i => i.type === 'feature');

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.backlog.title}</h2>
      <div className="flex gap-2">
        <button onClick={() => setShowAdd('epic')} className="btn-primary px-3 py-1.5 rounded-lg text-xs">+ Epic</button>
        <button onClick={() => setShowAdd('feature')} className="btn-secondary px-3 py-1.5 rounded-lg text-xs">+ Feature</button>
        <button onClick={() => setShowAdd('story')} className="btn-secondary px-3 py-1.5 rounded-lg text-xs">+ Story</button>
      </div>
    </div>
    <div className="glass rounded-xl p-4 space-y-2">
      {items.map(item => (
        <div key={item.id} onClick={() => setSelItem(item)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer">
          <TypeBadge type={item.type} />
          <span className="flex-1 text-white">{item.name}</span>
          {item.story_points > 0 && <Badge s="xs">{item.story_points} SP</Badge>}
          {item.sprint && <Badge v="warning" s="xs">S{item.sprint}</Badge>}
        </div>
      ))}
    </div>
    <Modal open={!!selItem} onClose={() => setSelItem(null)} title={selItem?.name} size="lg">
      {selItem && <div className="space-y-4">
        <TypeBadge type={selItem.type} />
        <TextArea label={t.board.desc} value={selItem.description || ''} onChange={e => updateItem(selItem.id, { description: e.target.value })} rows={3} />
        <TextArea label={t.board.ac} value={selItem.acceptance_criteria || ''} onChange={e => updateItem(selItem.id, { acceptance_criteria: e.target.value })} rows={4} />
        <div className="flex gap-3"><button onClick={() => { deleteItem(selItem.id); setSelItem(null); }} className="text-red-400 text-sm">{t.c.delete}</button></div>
      </div>}
    </Modal>
    <Modal open={!!showAdd} onClose={() => setShowAdd(null)} title={`Add ${showAdd}`}>
      <ItemAddForm type={showAdd} onSave={(item) => { addItem(item); setShowAdd(null); }} onClose={() => setShowAdd(null)} />
    </Modal>
  </div>;
};

const ItemAddForm = ({ type, onSave, onClose }) => {
  const { t, teams, items } = useApp();
  const [form, setForm] = useState({ type, name: '', description: '', story_points: type === 'epic' ? 0 : 20, team_id: teams[0]?.id, sprint: type === 'epic' ? null : 1, business_value: 5, status: 'notStarted', parent_id: null, acceptance_criteria: '' });
  const parentOptions = items.filter(i => type === 'feature' ? i.type === 'epic' : type === 'story' ? i.type === 'feature' : false);
  return <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
    <Input label={t.board.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
    <TextArea label={t.board.desc} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
    {parentOptions.length > 0 && <Select label={t.board.parent} value={form.parent_id || ''} onChange={e => setForm({ ...form, parent_id: e.target.value || null })}><option value="">— {t.c.none} —</option>{parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>}
    {type !== 'epic' && <div className="grid grid-cols-3 gap-4">
      <Select label={t.c.team} value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })}>{teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}</Select>
      <Select label={t.c.sprint} value={form.sprint || ''} onChange={e => setForm({ ...form, sprint: parseInt(e.target.value) || null })}><option value="">—</option>{[1,2,3,4,5].map(s => <option key={s} value={s}>S{s}</option>)}</Select>
      <Input label={t.board.sp} type="number" value={form.story_points} onChange={e => setForm({ ...form, story_points: parseInt(e.target.value) })} />
    </div>}
    <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

const ProgramBoard = () => {
  const { t, teams, items, sprints, milestones, updateItem } = useApp();
  const features = items.filter(i => i.type === 'feature' || i.type === 'story');
  const onDrop = (e, tid, sn) => { e.preventDefault(); const id = e.dataTransfer.getData('id'); updateItem(id, { team_id: tid, sprint: sn }); };
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.board.title}</h2>
    <div className="glass rounded-xl overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="flex border-b border-slate-700">
          <div className="w-32 shrink-0 p-3 bg-slate-900/80" />
          {sprints.map((sp, i) => <div key={i} className="flex-1 min-w-[140px] p-3 text-center border-l border-slate-700"><span className="font-semibold text-white">{sp.isIP ? 'IP' : `S${sp.num}`}</span></div>)}
        </div>
        {teams.map(tm => (
          <div key={tm.id} className="flex border-b border-slate-700">
            <div className="w-32 shrink-0 p-3 bg-slate-900/80 flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: tm.color }} /><span className="text-white text-sm">{tm.name}</span></div>
            {sprints.map((sp, i) => (
              <div key={i} className="flex-1 min-w-[140px] p-2 border-l border-slate-700 min-h-[80px]" onDrop={e => onDrop(e, tm.id, i + 1)} onDragOver={e => e.preventDefault()}>
                {features.filter(f => f.team_id === tm.id && f.sprint === i + 1).map(f => (
                  <div key={f.id} draggable onDragStart={e => e.dataTransfer.setData('id', f.id)} className="p-2 mb-1 rounded bg-slate-800/50 text-xs text-white cursor-move">
                    <TypeBadge type={f.type} /> {f.name.substring(0, 20)}...
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>;
};

const Objectives = () => {
  const { t, objectives, teams, updateObjective } = useApp();
  const committed = objectives.filter(o => o.committed);
  const planned = committed.reduce((s, o) => s + (o.planned_value || o.business_value), 0);
  const actual = committed.reduce((s, o) => s + (o.actual_value || 0), 0);
  const predict = planned > 0 ? (actual / planned) * 100 : 0;
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.obj.title}</h2>
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white">{t.obj.predict}</h3><Badge v={predict >= 80 ? 'success' : 'warning'} s="md">{predict.toFixed(0)}%</Badge></div>
      <Bar val={actual} max={planned} h="h-4" />
    </div>
    <div className="space-y-3">
      {objectives.map(o => <div key={o.id} className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-white">{o.name}</span>
          <input type="number" value={o.actual_value || ''} onChange={e => updateObjective(o.id, { actual_value: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 rounded input-field text-white text-sm" placeholder="Actual" />
        </div>
      </div>)}
    </div>
  </div>;
};

const RoamBoard = () => {
  const { t, risks, updateRisk } = useApp();
  const cols = ['resolved', 'owned', 'accepted', 'mitigated'];
  const [dragged, setDragged] = useState(null);
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.risk.title}</h2>
    <div className="grid grid-cols-4 gap-4">
      {cols.map(status => (
        <div key={status} className="glass rounded-xl p-4 min-h-[200px]" onDragOver={e => e.preventDefault()} onDrop={() => { if (dragged) updateRisk(dragged.id, { status }); setDragged(null); }}>
          <h3 className="font-semibold text-white mb-3">{t.risk[status]}</h3>
          {risks.filter(r => r.status === status).map(r => (
            <div key={r.id} draggable onDragStart={() => setDragged(r)} className="p-2 mb-2 rounded bg-slate-800/50 text-sm text-white cursor-move">{r.name}</div>
          ))}
        </div>
      ))}
    </div>
  </div>;
};

const Voting = () => {
  const { t, voting, setVoting } = useApp();
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState({});
  const start = () => { setVoting({ active: true, start: Date.now() }); setVotes({}); setUserVote(null); };
  const vote = v => { setUserVote(v); setVotes(p => ({ ...p, user: v })); };
  const voteVals = Object.values(votes);
  const avg = voteVals.length > 0 ? (voteVals.reduce((a, b) => a + b, 0) / voteVals.length).toFixed(1) : 0;
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.vote.title}</h2>
      {!voting?.active ? <button onClick={start} className="btn-primary px-6 py-2 rounded-lg">{t.vote.start}</button> : <button onClick={() => setVoting(null)} className="btn-secondary px-4 py-2 rounded-lg">{t.vote.end}</button>}
    </div>
    {voting?.active && !userVote && <div className="grid grid-cols-5 gap-4">
      {[1,2,3,4,5].map(v => <button key={v} onClick={() => vote(v)} className={`p-6 rounded-xl border-2 ${v <= 2 ? 'border-red-500/50' : v === 3 ? 'border-amber-500/50' : 'border-emerald-500/50'}`}>
        <div className="text-3xl">{v === 1 ? '✊' : v === 2 ? '☝️' : v === 3 ? '✌️' : v === 4 ? '🤟' : '🖐️'}</div>
        <div className="text-xl font-bold text-white mt-2">{v}</div>
      </button>)}
    </div>}
    {userVote && <div className="text-center py-8"><p className="text-slate-400">{t.vote.your}</p><div className="text-5xl mt-4">{userVote}</div></div>}
    {voteVals.length > 0 && <div className="glass rounded-xl p-6 text-center"><p className="text-xl text-white">{t.vote.avg}: {avg}</p></div>}
  </div>;
};

const Settings = () => {
  const { t, lang, setLang, teams, settings, setSettings, addTeam, updateTeam, deleteTeam, addMember, updateMember, deleteMember } = useApp();
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', color: '#22d3ee', velocity: 40 });
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.set.title}</h2>
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">{t.set.lang}</h3>
      <div className="flex gap-2">
        <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>English</button>
        <button onClick={() => setLang('pl')} className={`px-4 py-2 rounded-lg ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>Polski</button>
      </div>
    </div>
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">{t.set.autoFeatures}</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3"><input type="checkbox" checked={settings.autoStatus} onChange={e => setSettings({ ...settings, autoStatus: e.target.checked })} /><span className="text-slate-300">{t.set.autoStatus}</span></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={settings.autoSP} onChange={e => setSettings({ ...settings, autoSP: e.target.checked })} /><span className="text-slate-300">{t.set.autoSP}</span></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={settings.autoSuggest} onChange={e => setSettings({ ...settings, autoSuggest: e.target.checked })} /><span className="text-slate-300">{t.set.autoSuggest}</span></label>
      </div>
    </div>
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{t.set.editTeams}</h3>
        <button onClick={() => setShowAddTeam(true)} className="btn-primary px-4 py-2 rounded-lg text-sm">+ {t.set.addTeam}</button>
      </div>
      {teams.map(team => (
        <div key={team.id} className="p-4 mb-4 rounded-lg bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3">
            <input type="color" value={team.color} onChange={e => updateTeam(team.id, { color: e.target.value })} className="w-8 h-8 rounded" />
            <input type="text" value={team.name} onChange={e => updateTeam(team.id, { name: e.target.value })} className="px-3 py-1 rounded input-field text-white" />
            <input type="number" value={team.velocity} onChange={e => updateTeam(team.id, { velocity: parseInt(e.target.value) })} className="w-20 px-2 py-1 rounded input-field text-white text-center" />
            <button onClick={() => deleteTeam(team.id)} className="text-red-400"><Icon name="trash" className="w-4 h-4" /></button>
          </div>
          <div className="ml-11 space-y-2">
            {(team.team_members || []).map(m => (
              <div key={m.id} className="flex items-center gap-2 text-sm">
                <Icon name="user" className="w-4 h-4 text-slate-500" />
                <span className="text-white">{m.name}</span>
                <Badge s="xs">{m.role}</Badge>
                <button onClick={() => deleteMember(m.id)} className="ml-auto text-red-400"><Icon name="trash" className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <Modal open={showAddTeam} onClose={() => setShowAddTeam(false)} title={t.set.addTeam}>
      <div className="space-y-4">
        <Input label={t.set.teamName} value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs text-slate-400 mb-2">Color</label><input type="color" value={newTeam.color} onChange={e => setNewTeam({ ...newTeam, color: e.target.value })} className="w-full h-10 rounded" /></div>
          <Input label={t.set.velocity} type="number" value={newTeam.velocity} onChange={e => setNewTeam({ ...newTeam, velocity: parseInt(e.target.value) })} />
        </div>
        <button onClick={() => { addTeam(newTeam); setShowAddTeam(false); setNewTeam({ name: '', color: '#22d3ee', velocity: 40 }); }} className="w-full btn-primary py-2 rounded-lg">{t.c.add}</button>
      </div>
    </Modal>
  </div>;
};

const History = () => {
  const { t, history, isDemo } = useApp();
  if (isDemo) return <div className="space-y-6"><h2 className="text-2xl font-bold text-white">{t.hist.title}</h2><div className="glass rounded-xl p-8 text-center text-slate-400">History requires Supabase</div></div>;
  return <div className="space-y-6"><h2 className="text-2xl font-bold text-white">{t.hist.title}</h2><div className="glass rounded-xl p-4">{history.length === 0 && <p className="text-slate-400 text-center">{t.c.noData}</p>}</div></div>;
};

// Main App
export default function App() {
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('dashboard');
  const [pi, setPi] = useState('PI44');
  const [teams, setTeams] = useState([]);
  const [items, setItems] = useState([]);
  const [deps, setDeps] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [risks, setRisks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [absences, setAbsences] = useState({});
  const [history, setHistory] = useState([]);
  const [voting, setVoting] = useState(null);
  const [synced, setSynced] = useState(false);
  const [settings, setSettings] = useState({ autoStatus: true, autoSP: true, autoSuggest: true });
  const [integrations, setIntegrations] = useState({});
  const [alertConfig, setAlertConfig] = useState({ capacityOver: true, capacityWarn: true, lowConfidence: true, sprintStart: false, piStart: false, riskHigh: true });
  const t = T[lang];

  useEffect(() => { if (isConfigured()) { auth.getSession().then(({ data }) => { if (data.session) setUser(data.session.user); setLoading(false); }); } else setLoading(false); }, []);
  
  const loadData = useCallback(async () => { if (isDemo) { setTeams(demoTeams); setItems(demoItems); setDeps(demoDeps); setObjectives(demoObjectives); setRisks(demoRisks); setMilestones(demoMilestones); setSynced(true); } }, [isDemo]);
  useEffect(() => { if (user || isDemo) loadData(); }, [user, isDemo, loadData]);

  const handleAuth = (u) => setUser(u);
  const handleDemo = () => { setIsDemo(true); setUser({ email: 'demo@example.com', id: 'demo' }); };
  const handleSignOut = async () => { await auth.signOut(); setUser(null); setIsDemo(false); };

  const allMembers = useMemo(() => teams.flatMap(tm => tm.team_members || []), [teams]);
  const sprints = useMemo(() => calcSprints(pd(PI_PRESETS[pi].s), 10, 5), [pi]);
  const piSum = useMemo(() => { const s = pd(PI_PRESETS[pi].s), e = pd(PI_PRESETS[pi].e); return { calDays: Math.ceil((e - s) / 86400000) + 1, workDays: getWorkDays(s, e) }; }, [pi]);
  
  // Check alerts
  const alerts = useMemo(() => AlertEngine.checkAlerts({ teams, items, voting, sprints, pi }, alertConfig, integrations), [teams, items, voting, alertConfig]);

  const crud = {
    addTeam: (team) => setTeams(prev => [...prev, { ...team, id: uid(), team_members: [], historicalVelocity: [team.velocity] }]),
    updateTeam: (id, upd) => setTeams(prev => prev.map(t => t.id === id ? { ...t, ...upd } : t)),
    deleteTeam: (id) => setTeams(prev => prev.filter(t => t.id !== id)),
    addMember: (member) => setTeams(prev => prev.map(t => t.id === member.team_id ? { ...t, team_members: [...(t.team_members || []), { ...member, id: uid() }] } : t)),
    updateMember: (id, upd) => setTeams(prev => prev.map(t => ({ ...t, team_members: (t.team_members || []).map(m => m.id === id ? { ...m, ...upd } : m) }))),
    deleteMember: (id) => setTeams(prev => prev.map(t => ({ ...t, team_members: (t.team_members || []).filter(m => m.id !== id) }))),
    addItem: (item) => setItems(prev => [...prev, { ...item, id: uid() }]),
    updateItem: (id, upd) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i)),
    deleteItem: (id) => setItems(prev => prev.filter(i => i.id !== id)),
    addObjective: (obj) => setObjectives(prev => [...prev, { ...obj, id: uid() }]),
    updateObjective: (id, upd) => setObjectives(prev => prev.map(o => o.id === id ? { ...o, ...upd } : o)),
    addRisk: (risk) => setRisks(prev => [...prev, { ...risk, id: uid() }]),
    updateRisk: (id, upd) => setRisks(prev => prev.map(r => r.id === id ? { ...r, ...upd } : r)),
    updateAbsence: (teamId, memberId, sprint, days) => setAbsences(prev => ({ ...prev, [`${teamId}-${memberId}-${sprint}`]: days })),
  };

  const ctx = { t, lang, setLang, teams, setTeams, items, deps, objectives, risks, milestones, absences, allMembers, sprints, piSum, pi, setPi, user, isDemo, synced, history, voting, setVoting, settings, setSettings, integrations, setIntegrations, alertConfig, setAlertConfig, alerts, ...crud };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  if (!user && !isDemo) return <AuthScreen onAuth={handleAuth} onDemo={handleDemo} />;

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: 'dash' },
    { id: 'backlog', label: t.nav.backlog, icon: 'folder' },
    { id: 'capacity', label: t.nav.capacity, icon: 'cap' },
    { id: 'board', label: t.nav.board, icon: 'board' },
    { id: 'objectives', label: t.nav.objectives, icon: 'target' },
    { id: 'risks', label: t.nav.risks, icon: 'risk' },
    { id: 'voting', label: t.nav.voting, icon: 'vote' },
    { id: 'integrations', label: t.nav.integrations, icon: 'plug' },
    { id: 'reports', label: t.nav.reports, icon: 'chart' },
    { id: 'settings', label: t.nav.settings, icon: 'settings' },
    { id: 'history', label: t.nav.history, icon: 'history' },
  ];
  const views = { dashboard: Dashboard, backlog: Backlog, capacity: Capacity, board: ProgramBoard, objectives: Objectives, risks: RoamBoard, voting: Voting, integrations: Integrations, reports: Reports, settings: Settings, history: History };
  const View = views[view] || Dashboard;

  return <AppContext.Provider value={ctx}>
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); .glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.1); } .input-field { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 0.5rem; } .input-field:focus { border-color: rgba(34, 211, 238, 0.5); outline: none; } .btn-primary { background: linear-gradient(135deg, #22d3ee, #34d399); color: white; font-weight: 600; } .btn-secondary { background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.2); color: #94a3b8; }`}</style>
      <header className="glass sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center"><span className="text-xl font-bold text-white">π</span></div><div><h1 className="text-lg font-semibold">{t.app.title}</h1><p className="text-xs text-slate-400">{t.app.subtitle}</p></div></div>
          <div className="flex items-center gap-3">
            {alerts.length > 0 && <Badge v="danger">{alerts.length} alerts</Badge>}
            {synced && <Badge v="success">●</Badge>}
            {isDemo && <Badge v="warning">DEMO</Badge>}
            <div className="flex gap-1">{Object.keys(PI_PRESETS).map(p => <button key={p} onClick={() => setPi(p)} className={`px-2 py-1 rounded text-xs ${pi === p ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>{p}</button>)}</div>
            <button onClick={handleSignOut} className="text-xs text-red-400">{t.auth.signOut}</button>
          </div>
        </div>
      </header>
      <div className="max-w-[1600px] mx-auto flex">
        <nav className="w-56 shrink-0 p-4 sticky top-16 h-[calc(100vh-64px)]"><div className="space-y-1">{navItems.map(item => <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${view === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}><Icon name={item.icon} /><span>{item.label}</span></button>)}</div></nav>
        <main className="flex-1 p-6 min-h-[calc(100vh-64px)]"><View /></main>
      </div>
    </div>
  </AppContext.Provider>;
}
