import React, { useState, useMemo, createContext, useContext, useEffect, useCallback } from 'react';

const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ============ TRANSLATIONS ============
const T = {
  en: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Enterprise Edition' },
    nav: { capacity: 'Capacity Board', backlog: 'PI Backlog', teams: 'Teams', program: 'Program Board', dashboard: 'RTE Dashboard', whatif: 'What-If', risks: 'Risks & Confidence', settings: 'Settings' },
    auth: { signIn: 'Sign In', signUp: 'Sign Up', signOut: 'Sign Out', email: 'Email', password: 'Password', role: 'Role', demoMode: 'Demo Mode', admin: 'Admin', rte: 'RTE/PM', teamLead: 'Team Lead', member: 'Team Member', viewer: 'Viewer' },
    cap: { title: 'Capacity vs Demand', capacity: 'Capacity', demand: 'Demand', available: 'Available', overcommit: 'Overcommit!', healthy: 'Healthy', warning: 'Warning', danger: 'Over capacity', unplanned: 'Unplanned', dropHere: 'Drop items here', totalART: 'ART Total', loadFactor: 'Load Factor' },
    dash: { title: 'RTE Dashboard', subtitle: 'PI Health Overview', utilization: 'Utilization', overbooked: 'Overbooked Sprints', reserve: 'Reserve', avgLoad: 'Avg Load', totalCapacity: 'Total Capacity', totalDemand: 'Total Demand', healthScore: 'PI Health Score', teamBreakdown: 'Team Breakdown', sprintTrend: 'Sprint Load Trend', atRisk: 'At Risk', onTrack: 'On Track' },
    whatif: { title: 'What-If Scenarios', subtitle: 'Compare capacity scenarios', baseline: 'Baseline (Current)', scenarioA: 'Scenario A', scenarioB: 'Scenario B', addScenario: 'Add Scenario', adjustment: 'Adjustment', reduceCapacity: 'Reduce Capacity', moveItem: 'Move Item to PI', addTeam: 'Add Team', removeTeam: 'Remove Team', compare: 'Compare', impact: 'Impact', delta: 'Delta', apply: 'Apply Scenario' },
    deps: { title: 'Dependencies', subtitle: 'Cross-team dependencies', from: 'From', to: 'To', sprint: 'Sprint', status: 'Status', healthy: 'Healthy', atRisk: 'At Risk', violated: 'Violated', add: 'Add Dependency', lowReserve: 'Low reserve warning', noBuffer: 'No buffer!', provider: 'Provider', consumer: 'Consumer' },
    risks: { title: 'Risks & Confidence', subtitle: 'PI-level risk assessment', confidence: 'Confidence Vote', avgConfidence: 'ART Avg Confidence', teamConfidence: 'Team Confidence', topRisks: 'Top Risks', addRisk: 'Add Risk', severity: 'Severity', high: 'High', medium: 'Medium', low: 'Low', owner: 'Owner', mitigation: 'Mitigation', roam: 'ROAM Status', resolved: 'Resolved', owned: 'Owned', accepted: 'Accepted', mitigated: 'Mitigated', vote: 'Vote', voting: 'Voting Active', startVote: 'Start Voting', endVote: 'End Voting' },
    import: { title: 'Import Data', jira: 'Import from Jira', csv: 'Import from CSV', preview: 'Preview', import: 'Import', mapping: 'Field Mapping', source: 'Source Field', target: 'Target Field', rows: 'rows', success: 'Import successful', selectFile: 'Select CSV file', jiraUrl: 'Jira URL', jiraToken: 'API Token', jiraProject: 'Project Key', fetchItems: 'Fetch Items' },
    audit: { title: 'Audit Trail', user: 'User', action: 'Action', timestamp: 'Timestamp', details: 'Details', created: 'Created', updated: 'Updated', deleted: 'Deleted', filter: 'Filter by action' },
    teams: { title: 'Teams & Configuration', addTeam: 'Add Team', teamName: 'Team Name', velocity: 'Velocity (SP/Sprint)', members: 'Team Members', addMember: 'Add Member', fte: 'FTE', role: 'Role', absences: 'Absences', holidays: 'Holidays', calendar: 'PI Calendar' },
    backlog: { title: 'PI Backlog', addItem: 'Add Item', epic: 'Epic', feature: 'Feature', story: 'Story', enabler: 'Enabler', unassigned: 'Unassigned', quickAdd: 'Quick Add', name: 'Name', estimate: 'Estimate (SP)', team: 'Team', sprint: 'Sprint', priority: 'WSJF', description: 'Description' },
    program: { title: 'Program Board', milestones: 'Milestones', dependencies: 'Dependencies', features: 'Features' },
    c: { save: 'Save', cancel: 'Cancel', delete: 'Delete', add: 'Add', edit: 'Edit', close: 'Close', sp: 'SP', sprint: 'Sprint', team: 'Team', total: 'Total', avg: 'Avg', none: 'None', noData: 'No data', loading: 'Loading...', synced: 'Synced', export: 'Export', permissions: 'No permission' }
  },
  pl: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Enterprise Edition' },
    nav: { capacity: 'Capacity Board', backlog: 'PI Backlog', teams: 'Zespoły', program: 'Program Board', dashboard: 'Dashboard RTE', whatif: 'What-If', risks: 'Ryzyka', settings: 'Ustawienia' },
    auth: { signIn: 'Zaloguj', signUp: 'Rejestracja', signOut: 'Wyloguj', email: 'Email', password: 'Hasło', role: 'Rola', demoMode: 'Tryb Demo', admin: 'Admin', rte: 'RTE/PM', teamLead: 'Team Lead', member: 'Członek zespołu', viewer: 'Obserwator' },
    cap: { title: 'Capacity vs Demand', capacity: 'Capacity', demand: 'Demand', available: 'Dostępne', overcommit: 'Przekroczenie!', healthy: 'OK', warning: 'Uwaga', danger: 'Przekroczenie', unplanned: 'Nieprzypisane', dropHere: 'Upuść tutaj', totalART: 'Suma ART', loadFactor: 'Obciążenie' },
    dash: { title: 'Dashboard RTE', subtitle: 'Przegląd zdrowia PI', utilization: 'Wykorzystanie', overbooked: 'Przeciążone sprinty', reserve: 'Rezerwa', avgLoad: 'Śr. obciążenie', totalCapacity: 'Całk. capacity', totalDemand: 'Całk. demand', healthScore: 'Zdrowie PI', teamBreakdown: 'Podział na zespoły', sprintTrend: 'Trend obciążenia', atRisk: 'Zagrożone', onTrack: 'Na dobrej drodze' },
    whatif: { title: 'Scenariusze What-If', subtitle: 'Porównaj scenariusze capacity', baseline: 'Baseline (obecny)', scenarioA: 'Scenariusz A', scenarioB: 'Scenariusz B', addScenario: 'Dodaj scenariusz', adjustment: 'Zmiana', reduceCapacity: 'Zmniejsz capacity', moveItem: 'Przenieś do innego PI', addTeam: 'Dodaj zespół', removeTeam: 'Usuń zespół', compare: 'Porównaj', impact: 'Wpływ', delta: 'Różnica', apply: 'Zastosuj scenariusz' },
    deps: { title: 'Zależności', subtitle: 'Zależności między zespołami', from: 'Od', to: 'Do', sprint: 'Sprint', status: 'Status', healthy: 'OK', atRisk: 'Zagrożona', violated: 'Naruszona', add: 'Dodaj zależność', lowReserve: 'Mała rezerwa', noBuffer: 'Brak bufora!', provider: 'Dostawca', consumer: 'Odbiorca' },
    risks: { title: 'Ryzyka i Confidence', subtitle: 'Ocena ryzyka PI', confidence: 'Głosowanie Confidence', avgConfidence: 'Śr. Confidence ART', teamConfidence: 'Confidence zespołu', topRisks: 'Główne ryzyka', addRisk: 'Dodaj ryzyko', severity: 'Ważność', high: 'Wysoka', medium: 'Średnia', low: 'Niska', owner: 'Właściciel', mitigation: 'Mitygacja', roam: 'Status ROAM', resolved: 'Rozwiązane', owned: 'Z właścicielem', accepted: 'Zaakceptowane', mitigated: 'Zmitigowane', vote: 'Głosuj', voting: 'Głosowanie aktywne', startVote: 'Rozpocznij głosowanie', endVote: 'Zakończ głosowanie' },
    import: { title: 'Import danych', jira: 'Import z Jira', csv: 'Import z CSV', preview: 'Podgląd', import: 'Importuj', mapping: 'Mapowanie pól', source: 'Pole źródłowe', target: 'Pole docelowe', rows: 'wierszy', success: 'Import zakończony', selectFile: 'Wybierz plik CSV', jiraUrl: 'URL Jira', jiraToken: 'Token API', jiraProject: 'Klucz projektu', fetchItems: 'Pobierz elementy' },
    audit: { title: 'Historia zmian', user: 'Użytkownik', action: 'Akcja', timestamp: 'Czas', details: 'Szczegóły', created: 'Utworzono', updated: 'Zaktualizowano', deleted: 'Usunięto', filter: 'Filtruj po akcji' },
    teams: { title: 'Zespoły i konfiguracja', addTeam: 'Dodaj zespół', teamName: 'Nazwa zespołu', velocity: 'Velocity (SP/Sprint)', members: 'Członkowie', addMember: 'Dodaj osobę', fte: 'FTE', role: 'Rola', absences: 'Nieobecności', holidays: 'Święta', calendar: 'Kalendarz PI' },
    backlog: { title: 'PI Backlog', addItem: 'Dodaj', epic: 'Epic', feature: 'Feature', story: 'Story', enabler: 'Enabler', unassigned: 'Nieprzypisane', quickAdd: 'Szybkie dodawanie', name: 'Nazwa', estimate: 'Estymacja (SP)', team: 'Zespół', sprint: 'Sprint', priority: 'WSJF', description: 'Opis' },
    program: { title: 'Program Board', milestones: 'Kamienie milowe', dependencies: 'Zależności', features: 'Features' },
    c: { save: 'Zapisz', cancel: 'Anuluj', delete: 'Usuń', add: 'Dodaj', edit: 'Edytuj', close: 'Zamknij', sp: 'SP', sprint: 'Sprint', team: 'Zespół', total: 'Suma', avg: 'Średnia', none: 'Brak', noData: 'Brak danych', loading: 'Ładowanie...', synced: 'Zsync.', export: 'Eksport', permissions: 'Brak uprawnień' }
  }
};

// ============ CONSTANTS ============
const HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'Nowy Rok' }, { date: '2025-01-06', name: 'Trzech Króli' },
  { date: '2025-04-20', name: 'Wielkanoc' }, { date: '2025-04-21', name: 'Poniedziałek Wielkanocny' },
  { date: '2025-05-01', name: 'Święto Pracy' }, { date: '2025-05-03', name: 'Konstytucja 3 Maja' },
  { date: '2025-06-08', name: 'Zielone Świątki' }, { date: '2025-06-19', name: 'Boże Ciało' },
  { date: '2025-08-15', name: 'Wniebowzięcie NMP' }, { date: '2025-11-01', name: 'Wszystkich Świętych' },
  { date: '2025-11-11', name: 'Niepodległości' }, { date: '2025-12-25', name: 'Boże Narodzenie' },
  { date: '2025-12-26', name: 'Drugi dzień świąt' },
];

const PI_CONFIG = {
  PI44: { name: 'PI 2025.1', start: '2025-02-19', sprints: 5, sprintLength: 10 },
  PI45: { name: 'PI 2025.2', start: '2025-04-30', sprints: 5, sprintLength: 10 },
  PI46: { name: 'PI 2025.3', start: '2025-07-09', sprints: 5, sprintLength: 10 },
};

const ROLES = {
  admin: { level: 100, canEdit: true, canDelete: true, canImport: true, canManageUsers: true },
  rte: { level: 80, canEdit: true, canDelete: true, canImport: true, canManageUsers: false },
  teamLead: { level: 60, canEdit: true, canDelete: false, canImport: false, canManageUsers: false },
  member: { level: 40, canEdit: false, canDelete: false, canImport: false, canManageUsers: false },
  viewer: { level: 20, canEdit: false, canDelete: false, canImport: false, canManageUsers: false },
};

const ITEM_TYPES = {
  epic: { color: '#8b5cf6', label: 'Epic' },
  feature: { color: '#22d3ee', label: 'Feature' },
  story: { color: '#34d399', label: 'Story' },
  enabler: { color: '#f59e0b', label: 'Enabler' },
};

// ============ UTILITIES ============
const uid = () => crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
const parseDate = (s) => new Date(s + 'T00:00:00');
const formatDate = (d) => d.toISOString().split('T')[0];
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
const isHoliday = (d) => HOLIDAYS_2025.some(h => h.date === formatDate(d));
const getWorkDays = (start, end) => { let c = 0; const cur = new Date(start); while (cur <= end) { if (!isWeekend(cur) && !isHoliday(cur)) c++; cur.setDate(cur.getDate() + 1); } return c; };
const addWorkDays = (start, days) => { const r = new Date(start); let a = 0; while (a < days) { r.setDate(r.getDate() + 1); if (!isWeekend(r) && !isHoliday(r)) a++; } return r; };

const calculateSprints = (piConfig) => {
  const sprints = []; let cur = parseDate(piConfig.start);
  for (let i = 1; i <= piConfig.sprints; i++) {
    const end = addWorkDays(cur, piConfig.sprintLength - 1);
    sprints.push({ num: i, name: i === piConfig.sprints ? 'IP' : `Sprint ${i}`, start: new Date(cur), end, workDays: getWorkDays(cur, end), isIP: i === piConfig.sprints });
    cur = new Date(end); cur.setDate(cur.getDate() + 1); while (isWeekend(cur)) cur.setDate(cur.getDate() + 1);
  }
  return sprints;
};

const getLoadColor = (load) => {
  if (load <= 0.8) return { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', fill: '#34d399' };
  if (load <= 1.0) return { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', fill: '#f59e0b' };
  return { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', fill: '#ef4444' };
};

// ============ DEMO DATA ============
const createDemoData = () => {
  const teams = [
    { id: 'team1', name: 'Team Alpha', color: '#22d3ee', velocity: 40, members: [
      { id: 'm1', name: 'Anna Kowalska', fte: 1.0, role: 'Developer' },
      { id: 'm2', name: 'Jan Nowak', fte: 1.0, role: 'Developer' },
      { id: 'm3', name: 'Maria Wiśniewska', fte: 0.8, role: 'Developer' },
      { id: 'm4', name: 'Piotr Zieliński', fte: 1.0, role: 'QA' },
    ], confidence: 4, historicalVelocity: [38, 42, 40, 35, 44, 41] },
    { id: 'team2', name: 'Team Beta', color: '#34d399', velocity: 35, members: [
      { id: 'm5', name: 'Katarzyna Lewandowska', fte: 1.0, role: 'Developer' },
      { id: 'm6', name: 'Tomasz Wójcik', fte: 1.0, role: 'Developer' },
      { id: 'm7', name: 'Agnieszka Kamińska', fte: 1.0, role: 'Developer' },
      { id: 'm8', name: 'Michał Szymański', fte: 0.5, role: 'QA' },
    ], confidence: 3, historicalVelocity: [32, 36, 34, 38, 33, 35] },
    { id: 'team3', name: 'Team Gamma', color: '#f59e0b', velocity: 30, members: [
      { id: 'm9', name: 'Ewa Dąbrowska', fte: 1.0, role: 'Developer' },
      { id: 'm10', name: 'Robert Mazur', fte: 1.0, role: 'Developer' },
      { id: 'm11', name: 'Joanna Krawczyk', fte: 1.0, role: 'Tech Lead' },
    ], confidence: 4, historicalVelocity: [28, 32, 30, 29, 31, 30] },
  ];

  const items = [
    { id: 'e1', type: 'epic', name: 'User Management Platform', sp: 0, teamId: null, sprint: null, description: 'Complete user management', wsjf: 21 },
    { id: 'f1', type: 'feature', name: 'OAuth2 Authentication', sp: 40, teamId: 'team1', sprint: 1, parentId: 'e1', wsjf: 20 },
    { id: 'f2', type: 'feature', name: 'User Profiles', sp: 20, teamId: 'team1', sprint: 2, parentId: 'e1', wsjf: 15 },
    { id: 'f3', type: 'feature', name: 'REST API v1', sp: 48, teamId: 'team2', sprint: 1, wsjf: 22 },
    { id: 'f4', type: 'feature', name: 'Dashboard Charts', sp: 35, teamId: 'team2', sprint: 2, wsjf: 17 },
    { id: 'f5', type: 'feature', name: 'Permission System', sp: 25, teamId: 'team1', sprint: 3, wsjf: 19 },
    { id: 'f6', type: 'feature', name: 'Data Export', sp: 20, teamId: 'team3', sprint: 2, wsjf: 14 },
    { id: 'f7', type: 'feature', name: 'Real-time Updates', sp: 30, teamId: 'team3', sprint: 3, wsjf: 16 },
    { id: 'en1', type: 'enabler', name: 'CI/CD Pipeline', sp: 13, teamId: 'team3', sprint: 1, wsjf: 25 },
    { id: 'en2', type: 'enabler', name: 'Database Migration', sp: 8, teamId: 'team2', sprint: 1, wsjf: 23 },
    { id: 'f8', type: 'feature', name: 'Mobile App Shell', sp: 40, teamId: null, sprint: null, wsjf: 12 },
    { id: 'f9', type: 'feature', name: 'Push Notifications', sp: 20, teamId: null, sprint: null, wsjf: 11 },
  ];

  const dependencies = [
    { id: 'd1', fromId: 'f3', toId: 'f1', fromTeam: 'team2', toTeam: 'team1', fromSprint: 1, toSprint: 2, description: 'API needed for Auth' },
    { id: 'd2', fromId: 'f1', toId: 'f5', fromTeam: 'team1', toTeam: 'team1', fromSprint: 1, toSprint: 3, description: 'Auth needed for Permissions' },
    { id: 'd3', fromId: 'f4', toId: 'f6', fromTeam: 'team2', toTeam: 'team3', fromSprint: 2, toSprint: 2, description: 'Charts for Export' },
  ];

  const risks = [
    { id: 'r1', name: 'Third-party API rate limits', severity: 'high', owner: 'Team Beta', status: 'owned', mitigation: 'Implement caching layer', teamId: 'team2' },
    { id: 'r2', name: 'New team member onboarding', severity: 'medium', owner: 'Team Alpha', status: 'mitigated', mitigation: 'Pair programming sessions', teamId: 'team1' },
    { id: 'r3', name: 'Database performance', severity: 'low', owner: 'Team Gamma', status: 'accepted', mitigation: 'Monitor and optimize', teamId: 'team3' },
  ];

  const absences = { 'team1-m1-2': 2, 'team1-m3-3': 5, 'team2-m5-1': 3 };
  const milestones = [{ id: 'ms1', name: 'MVP Release', sprint: 3, color: '#f59e0b' }, { id: 'ms2', name: 'Beta Launch', sprint: 5, color: '#8b5cf6' }];
  const auditLog = [
    { id: 'a1', user: 'anna@company.com', action: 'created', entity: 'Feature', entityId: 'f1', timestamp: '2025-02-01T10:00:00Z', details: 'Created OAuth2 Authentication' },
    { id: 'a2', user: 'jan@company.com', action: 'updated', entity: 'Feature', entityId: 'f3', timestamp: '2025-02-02T14:30:00Z', details: 'Changed SP from 40 to 48' },
  ];

  return { teams, items, dependencies, risks, absences, milestones, auditLog };
};

// ============ COMPONENTS ============
const Icon = ({ name, className = 'w-5 h-5' }) => {
  const paths = {
    capacity: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    backlog: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    teams: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    program: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
    dashboard: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    whatif: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    risks: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    plus: 'M12 4v16m8-8H4', x: 'M6 18L18 6M6 6l12 12', check: 'M5 13l4 4L19 7',
    edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
    download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    history: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name] || paths.check} /></svg>;
};

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = { default: 'bg-slate-700 text-slate-300', success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', danger: 'bg-red-500/20 text-red-400 border border-red-500/30', info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30', purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>{children}</span>;
};

const TypeBadge = ({ type }) => {
  const c = ITEM_TYPES[type] || ITEM_TYPES.feature;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.label}</span>;
};

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-slate-900 border border-slate-700 rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden shadow-2xl`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg"><Icon name="x" /></button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, trend, color = 'cyan' }) => {
  const colors = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400', purple: 'text-purple-400' };
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[color]}`}>{value}</p>
      {trend !== undefined && <p className={`text-xs mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</p>}
    </div>
  );
};

// ============ AUTH SCREEN ============
const AuthScreen = ({ onDemo }) => {
  const [lang, setLang] = useState('pl');
  const [role, setRole] = useState('rte');
  const t = T[lang];
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-3xl font-bold text-white">π</span>
          </div>
          <div><h1 className="text-2xl font-bold text-white">{t.app.title}</h1><p className="text-sm text-slate-400">{t.app.subtitle}</p></div>
        </div>
        <div className="flex gap-2 mb-6 justify-center">
          <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg text-sm ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>English</button>
          <button onClick={() => setLang('pl')} className={`px-4 py-2 rounded-lg text-sm ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>Polski</button>
        </div>
        <div className="mb-6">
          <label className="block text-xs text-slate-400 uppercase mb-2">{t.auth.role}</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white">
            <option value="admin">{t.auth.admin}</option>
            <option value="rte">{t.auth.rte}</option>
            <option value="teamLead">{t.auth.teamLead}</option>
            <option value="member">{t.auth.member}</option>
            <option value="viewer">{t.auth.viewer}</option>
          </select>
        </div>
        <button onClick={() => onDemo(role, lang)} className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
          {t.auth.demoMode}
        </button>
      </div>
    </div>
  );
};

// ============ RTE DASHBOARD ============
const RTEDashboard = () => {
  const { t, teams, items, sprints, absences, dependencies, risks } = useApp();

  const stats = useMemo(() => {
    let totalCap = 0, totalDemand = 0, overbookedCount = 0;
    const teamStats = [];

    teams.forEach(team => {
      let teamCap = 0, teamDemand = 0, teamOverbooked = 0;
      sprints.forEach((sprint, idx) => {
        const sprintNum = idx + 1;
        const cap = sprint.isIP ? team.velocity * 0.2 : team.velocity;
        const demand = items.filter(i => i.teamId === team.id && i.sprint === sprintNum).reduce((s, i) => s + (i.sp || 0), 0);
        teamCap += cap;
        teamDemand += demand;
        if (demand > cap) { teamOverbooked++; overbookedCount++; }
      });
      teamStats.push({ ...team, capacity: teamCap, demand: teamDemand, load: teamCap > 0 ? teamDemand / teamCap : 0, overbooked: teamOverbooked });
      totalCap += teamCap;
      totalDemand += teamDemand;
    });

    const avgLoad = totalCap > 0 ? totalDemand / totalCap : 0;
    const reserve = totalCap - totalDemand;
    const avgConfidence = teams.reduce((s, t) => s + (t.confidence || 3), 0) / teams.length;
    const atRiskDeps = dependencies.filter(d => d.fromSprint >= d.toSprint).length;
    const healthScore = Math.max(0, 100 - (overbookedCount * 10) - (atRiskDeps * 5) - ((5 - avgConfidence) * 10));

    return { totalCap, totalDemand, avgLoad, reserve, overbookedCount, teamStats, avgConfidence, healthScore, atRiskDeps, totalRisks: risks.filter(r => r.status !== 'resolved').length };
  }, [teams, items, sprints, dependencies, risks]);

  const sprintLoads = useMemo(() => {
    return sprints.map((sprint, idx) => {
      const sprintNum = idx + 1;
      let cap = 0, demand = 0;
      teams.forEach(team => {
        cap += sprint.isIP ? team.velocity * 0.2 : team.velocity;
        demand += items.filter(i => i.teamId === team.id && i.sprint === sprintNum).reduce((s, i) => s + (i.sp || 0), 0);
      });
      return { name: sprint.name, capacity: cap, demand, load: cap > 0 ? demand / cap : 0 };
    });
  }, [teams, items, sprints]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">{t.dash.title}</h2><p className="text-slate-400">{t.dash.subtitle}</p></div>
        <div className={`px-6 py-3 rounded-2xl ${stats.healthScore >= 70 ? 'bg-emerald-500/20 border-emerald-500/50' : stats.healthScore >= 40 ? 'bg-amber-500/20 border-amber-500/50' : 'bg-red-500/20 border-red-500/50'} border`}>
          <p className="text-xs opacity-70">{t.dash.healthScore}</p>
          <p className={`text-3xl font-bold ${stats.healthScore >= 70 ? 'text-emerald-400' : stats.healthScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{stats.healthScore.toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Stat label={t.dash.totalCapacity} value={`${stats.totalCap} SP`} color="cyan" />
        <Stat label={t.dash.totalDemand} value={`${stats.totalDemand} SP`} color="purple" />
        <Stat label={t.dash.avgLoad} value={`${(stats.avgLoad * 100).toFixed(0)}%`} color={stats.avgLoad > 1 ? 'red' : stats.avgLoad > 0.8 ? 'amber' : 'emerald'} />
        <Stat label={t.dash.reserve} value={`${stats.reserve} SP`} color={stats.reserve < 0 ? 'red' : 'emerald'} />
        <Stat label={t.dash.overbooked} value={stats.overbookedCount} color={stats.overbookedCount > 0 ? 'red' : 'emerald'} />
        <Stat label={t.risks.avgConfidence} value={`${stats.avgConfidence.toFixed(1)}/5`} color={stats.avgConfidence >= 3.5 ? 'emerald' : 'amber'} />
      </div>

      {/* Sprint Load Trend */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">{t.dash.sprintTrend}</h3>
        <div className="flex items-end gap-4 h-48">
          {sprintLoads.map((sprint, i) => {
            const color = getLoadColor(sprint.load);
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-40">
                  <div className="relative w-full">
                    <div className="absolute bottom-0 w-full bg-slate-700/50 rounded-t" style={{ height: '100%' }} />
                    <div className={`absolute bottom-0 w-full rounded-t transition-all ${color.bg}`} style={{ height: `${Math.min(sprint.load * 100, 100)}%`, backgroundColor: color.fill + '40' }} />
                    <div className="absolute bottom-0 w-full h-0.5 bg-amber-500/50" style={{ bottom: '80%' }} />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{sprint.name}</p>
                <p className={`text-sm font-bold ${color.text}`}>{(sprint.load * 100).toFixed(0)}%</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-slate-400">
          <span>— 80% target line</span>
        </div>
      </div>

      {/* Team Breakdown */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">{t.dash.teamBreakdown}</h3>
        <div className="space-y-4">
          {stats.teamStats.map(team => {
            const color = getLoadColor(team.load);
            return (
              <div key={team.id} className="flex items-center gap-4">
                <div className="w-32 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                  <span className="text-white text-sm font-medium">{team.name}</span>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative">
                    <div className={`h-full rounded-full transition-all`} style={{ width: `${Math.min(team.load * 100, 100)}%`, backgroundColor: color.fill }} />
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className="text-xs text-white font-medium">{team.demand}/{team.capacity} SP</span>
                      <span className={`text-xs font-bold ${color.text}`}>{(team.load * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 text-right">
                  {team.overbooked > 0 ? (
                    <Badge variant="danger">{team.overbooked} overbooked</Badge>
                  ) : (
                    <Badge variant="success">{t.dash.onTrack}</Badge>
                  )}
                </div>
                <div className="w-20 text-center">
                  <span className="text-sm text-slate-400">Conf: {team.confidence}/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="link" className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-slate-400">{t.deps.title}</span>
          </div>
          <p className="text-2xl font-bold text-white">{dependencies.length}</p>
          {stats.atRiskDeps > 0 && <p className="text-xs text-red-400 mt-1">{stats.atRiskDeps} at risk</p>}
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="alert" className="w-5 h-5 text-red-400" />
            <span className="text-sm text-slate-400">{t.risks.topRisks}</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalRisks}</p>
          <p className="text-xs text-slate-400 mt-1">{risks.filter(r => r.severity === 'high').length} high severity</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="backlog" className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">{t.cap.unplanned}</span>
          </div>
          <p className="text-2xl font-bold text-white">{items.filter(i => !i.teamId || !i.sprint).length}</p>
          <p className="text-xs text-slate-400 mt-1">{items.filter(i => !i.teamId || !i.sprint).reduce((s, i) => s + (i.sp || 0), 0)} SP</p>
        </div>
      </div>
    </div>
  );
};

// ============ WHAT-IF SCENARIOS ============
const WhatIfView = () => {
  const { t, teams, items, sprints } = useApp();
  const [scenarios, setScenarios] = useState([
    { id: 'baseline', name: t.whatif.baseline, adjustments: [], isBaseline: true },
    { id: 'a', name: t.whatif.scenarioA, adjustments: [{ type: 'reduceCapacity', teamId: 'team2', value: 20 }] },
    { id: 'b', name: t.whatif.scenarioB, adjustments: [{ type: 'addTeam', name: 'Team Delta', velocity: 25 }] },
  ]);
  const [showAddScenario, setShowAddScenario] = useState(false);

  const calculateScenario = (scenario) => {
    let scenarioTeams = [...teams];
    let scenarioItems = [...items];

    scenario.adjustments.forEach(adj => {
      if (adj.type === 'reduceCapacity') {
        scenarioTeams = scenarioTeams.map(t => t.id === adj.teamId ? { ...t, velocity: Math.round(t.velocity * (1 - adj.value / 100)) } : t);
      } else if (adj.type === 'addTeam') {
        scenarioTeams = [...scenarioTeams, { id: uid(), name: adj.name, velocity: adj.velocity, color: '#94a3b8', members: [] }];
      } else if (adj.type === 'removeTeam') {
        scenarioTeams = scenarioTeams.filter(t => t.id !== adj.teamId);
        scenarioItems = scenarioItems.map(i => i.teamId === adj.teamId ? { ...i, teamId: null, sprint: null } : i);
      } else if (adj.type === 'moveItem') {
        scenarioItems = scenarioItems.map(i => i.id === adj.itemId ? { ...i, teamId: adj.newTeamId, sprint: adj.newSprint } : i);
      }
    });

    let totalCap = 0, totalDemand = 0, overbooked = 0;
    scenarioTeams.forEach(team => {
      sprints.forEach((sprint, idx) => {
        const cap = sprint.isIP ? team.velocity * 0.2 : team.velocity;
        const demand = scenarioItems.filter(i => i.teamId === team.id && i.sprint === idx + 1).reduce((s, i) => s + (i.sp || 0), 0);
        totalCap += cap;
        totalDemand += demand;
        if (demand > cap) overbooked++;
      });
    });

    return { teams: scenarioTeams, items: scenarioItems, totalCap, totalDemand, load: totalCap > 0 ? totalDemand / totalCap : 0, overbooked, reserve: totalCap - totalDemand };
  };

  const scenarioResults = useMemo(() => scenarios.map(s => ({ ...s, result: calculateScenario(s) })), [scenarios, teams, items, sprints]);
  const baseline = scenarioResults.find(s => s.isBaseline)?.result || { totalCap: 0, totalDemand: 0, load: 0, overbooked: 0, reserve: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">{t.whatif.title}</h2><p className="text-slate-400">{t.whatif.subtitle}</p></div>
        <button onClick={() => setShowAddScenario(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium flex items-center gap-2">
          <Icon name="plus" className="w-5 h-5" /> {t.whatif.addScenario}
        </button>
      </div>

      {/* Scenario Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarioResults.map(scenario => {
          const delta = {
            load: ((scenario.result.load - baseline.load) * 100).toFixed(1),
            reserve: scenario.result.reserve - baseline.reserve,
            overbooked: scenario.result.overbooked - baseline.overbooked,
          };
          const color = getLoadColor(scenario.result.load);
          
          return (
            <div key={scenario.id} className={`bg-slate-900/50 border rounded-2xl overflow-hidden ${scenario.isBaseline ? 'border-cyan-500/50' : 'border-slate-700'}`}>
              <div className={`p-4 border-b border-slate-700 ${scenario.isBaseline ? 'bg-cyan-500/10' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{scenario.name}</h3>
                  {scenario.isBaseline && <Badge variant="info">Current</Badge>}
                </div>
                {scenario.adjustments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {scenario.adjustments.map((adj, i) => (
                      <p key={i} className="text-xs text-slate-400">
                        • {adj.type === 'reduceCapacity' && `${teams.find(t => t.id === adj.teamId)?.name}: -${adj.value}% capacity`}
                        {adj.type === 'addTeam' && `Add ${adj.name} (${adj.velocity} SP/sprint)`}
                        {adj.type === 'removeTeam' && `Remove ${teams.find(t => t.id === adj.teamId)?.name}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">{t.dash.totalCapacity}</p>
                    <p className="text-xl font-bold text-white">{scenario.result.totalCap} SP</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{t.dash.totalDemand}</p>
                    <p className="text-xl font-bold text-white">{scenario.result.totalDemand} SP</p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${color.bg} ${color.border} border`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{t.cap.loadFactor}</span>
                    <span className={`text-xl font-bold ${color.text}`}>{(scenario.result.load * 100).toFixed(0)}%</span>
                  </div>
                  {!scenario.isBaseline && (
                    <p className={`text-xs mt-1 ${parseFloat(delta.load) <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {parseFloat(delta.load) > 0 ? '+' : ''}{delta.load}% vs baseline
                    </p>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-slate-400">{t.dash.reserve}</p>
                    <p className={`font-bold ${scenario.result.reserve >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scenario.result.reserve} SP
                      {!scenario.isBaseline && <span className="text-xs ml-1">({delta.reserve >= 0 ? '+' : ''}{delta.reserve})</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400">{t.dash.overbooked}</p>
                    <p className={`font-bold ${scenario.result.overbooked === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scenario.result.overbooked}
                      {!scenario.isBaseline && delta.overbooked !== 0 && <span className="text-xs ml-1">({delta.overbooked >= 0 ? '+' : ''}{delta.overbooked})</span>}
                    </p>
                  </div>
                </div>
                {!scenario.isBaseline && (
                  <button className="w-full py-2 rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm">
                    {t.whatif.apply}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Scenario Modal */}
      <Modal open={showAddScenario} onClose={() => setShowAddScenario(false)} title={t.whatif.addScenario}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">Scenario Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" placeholder="Scenario C" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">{t.whatif.adjustment}</label>
            <select className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
              <option value="reduceCapacity">{t.whatif.reduceCapacity}</option>
              <option value="addTeam">{t.whatif.addTeam}</option>
              <option value="removeTeam">{t.whatif.removeTeam}</option>
              <option value="moveItem">{t.whatif.moveItem}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowAddScenario(false)} className="px-4 py-2 rounded-lg text-slate-400">{t.c.cancel}</button>
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">{t.c.add}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============ DEPENDENCIES VIEW ============
const DependenciesView = () => {
  const { t, teams, items, sprints, dependencies, addDependency, updateDependency, deleteDependency } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newDep, setNewDep] = useState({ fromId: '', toId: '', description: '' });

  const features = items.filter(i => i.type === 'feature' || i.type === 'enabler');

  const depAnalysis = useMemo(() => {
    return dependencies.map(dep => {
      const fromItem = items.find(i => i.id === dep.fromId);
      const toItem = items.find(i => i.id === dep.toId);
      const fromTeam = teams.find(t => t.id === fromItem?.teamId);
      const toTeam = teams.find(t => t.id === toItem?.teamId);
      
      // Calculate reserve in target sprint
      const toSprint = toItem?.sprint || 0;
      const fromSprint = fromItem?.sprint || 0;
      
      let status = 'healthy';
      let warning = null;
      
      if (fromSprint >= toSprint && fromSprint && toSprint) {
        status = 'violated';
        warning = t.deps.noBuffer;
      } else if (fromSprint === toSprint - 1) {
        // Check if there's low reserve in the sprint
        const targetTeamLoad = items.filter(i => i.teamId === toItem?.teamId && i.sprint === toSprint).reduce((s, i) => s + (i.sp || 0), 0);
        const targetTeamCap = toTeam?.velocity || 40;
        if (targetTeamLoad / targetTeamCap > 0.9) {
          status = 'atRisk';
          warning = t.deps.lowReserve;
        }
      }
      
      return { ...dep, fromItem, toItem, fromTeam, toTeam, status, warning };
    });
  }, [dependencies, items, teams, t]);

  const handleAddDep = () => {
    if (!newDep.fromId || !newDep.toId) return;
    const fromItem = items.find(i => i.id === newDep.fromId);
    const toItem = items.find(i => i.id === newDep.toId);
    addDependency({
      id: uid(),
      ...newDep,
      fromTeam: fromItem?.teamId,
      toTeam: toItem?.teamId,
      fromSprint: fromItem?.sprint,
      toSprint: toItem?.sprint,
    });
    setNewDep({ fromId: '', toId: '', description: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">{t.deps.title}</h2><p className="text-slate-400">{t.deps.subtitle}</p></div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium flex items-center gap-2">
          <Icon name="plus" className="w-5 h-5" /> {t.deps.add}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p className="text-xs text-emerald-400 uppercase">{t.deps.healthy}</p>
          <p className="text-2xl font-bold text-emerald-400">{depAnalysis.filter(d => d.status === 'healthy').length}</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-xs text-amber-400 uppercase">{t.deps.atRisk}</p>
          <p className="text-2xl font-bold text-amber-400">{depAnalysis.filter(d => d.status === 'atRisk').length}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-xs text-red-400 uppercase">{t.deps.violated}</p>
          <p className="text-2xl font-bold text-red-400">{depAnalysis.filter(d => d.status === 'violated').length}</p>
        </div>
      </div>

      {/* Dependencies List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-xs uppercase text-slate-400">
              <th className="px-4 py-3 text-left">{t.deps.provider}</th>
              <th className="px-4 py-3 text-center">→</th>
              <th className="px-4 py-3 text-left">{t.deps.consumer}</th>
              <th className="px-4 py-3 text-center">{t.deps.status}</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {depAnalysis.map(dep => (
              <tr key={dep.id} className={`hover:bg-slate-800/30 ${dep.status === 'violated' ? 'bg-red-500/5' : dep.status === 'atRisk' ? 'bg-amber-500/5' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dep.fromTeam?.color }} />
                    <div>
                      <p className="text-white text-sm">{dep.fromItem?.name}</p>
                      <p className="text-xs text-slate-400">{dep.fromTeam?.name} • S{dep.fromItem?.sprint}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-slate-400">→</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dep.toTeam?.color }} />
                    <div>
                      <p className="text-white text-sm">{dep.toItem?.name}</p>
                      <p className="text-xs text-slate-400">{dep.toTeam?.name} • S{dep.toItem?.sprint}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={dep.status === 'healthy' ? 'success' : dep.status === 'atRisk' ? 'warning' : 'danger'}>
                    {t.deps[dep.status]}
                  </Badge>
                  {dep.warning && <p className="text-xs text-red-400 mt-1">{dep.warning}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">{dep.description}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => deleteDependency(dep.id)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400">
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {depAnalysis.length === 0 && <p className="text-center text-slate-500 py-8">{t.c.noData}</p>}
      </div>

      {/* Visual Board */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">Dependency Map</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex border-b border-slate-700 pb-2 mb-4">
              <div className="w-32" />
              {sprints.map((s, i) => <div key={i} className="flex-1 text-center text-sm text-slate-400">{s.name}</div>)}
            </div>
            {teams.map(team => (
              <div key={team.id} className="flex items-center mb-2">
                <div className="w-32 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                  <span className="text-sm text-white">{team.name}</span>
                </div>
                {sprints.map((s, i) => {
                  const sprintItems = features.filter(f => f.teamId === team.id && f.sprint === i + 1);
                  return (
                    <div key={i} className="flex-1 px-1">
                      {sprintItems.map(item => {
                        const hasDep = depAnalysis.some(d => d.fromId === item.id || d.toId === item.id);
                        const isViolated = depAnalysis.some(d => (d.fromId === item.id || d.toId === item.id) && d.status === 'violated');
                        return (
                          <div key={item.id} className={`text-xs p-1 rounded mb-1 truncate ${hasDep ? (isViolated ? 'bg-red-500/20 border border-red-500/50' : 'bg-cyan-500/20 border border-cyan-500/50') : 'bg-slate-800'}`}>
                            {hasDep && <span className="mr-1">⛓</span>}
                            {item.name}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.deps.add}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">{t.deps.provider}</label>
            <select value={newDep.fromId} onChange={e => setNewDep({ ...newDep, fromId: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
              <option value="">Select...</option>
              {features.filter(f => f.teamId && f.sprint).map(f => <option key={f.id} value={f.id}>{f.name} ({teams.find(t => t.id === f.teamId)?.name} S{f.sprint})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">{t.deps.consumer}</label>
            <select value={newDep.toId} onChange={e => setNewDep({ ...newDep, toId: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
              <option value="">Select...</option>
              {features.filter(f => f.teamId && f.sprint).map(f => <option key={f.id} value={f.id}>{f.name} ({teams.find(t => t.id === f.teamId)?.name} S{f.sprint})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">Description</label>
            <input type="text" value={newDep.description} onChange={e => setNewDep({ ...newDep, description: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-slate-400">{t.c.cancel}</button>
            <button onClick={handleAddDep} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">{t.c.add}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============ RISKS & CONFIDENCE ============
const RisksView = () => {
  const { t, teams, risks, addRisk, updateRisk, deleteRisk, updateTeam, userRole } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [votingActive, setVotingActive] = useState(false);
  const [newRisk, setNewRisk] = useState({ name: '', severity: 'medium', owner: '', teamId: '', mitigation: '', status: 'owned' });

  const avgConfidence = teams.reduce((s, t) => s + (t.confidence || 3), 0) / teams.length;
  const canEdit = ROLES[userRole]?.canEdit;

  const handleVote = (teamId, vote) => {
    if (!votingActive || !canEdit) return;
    updateTeam(teamId, { confidence: vote });
  };

  const handleAddRisk = () => {
    if (!newRisk.name) return;
    addRisk({ ...newRisk, id: uid() });
    setNewRisk({ name: '', severity: 'medium', owner: '', teamId: '', mitigation: '', status: 'owned' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-white">{t.risks.title}</h2><p className="text-slate-400">{t.risks.subtitle}</p></div>
        <div className="flex gap-2">
          {canEdit && (
            <button onClick={() => setVotingActive(!votingActive)} className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${votingActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
              {votingActive ? t.risks.endVote : t.risks.startVote}
            </button>
          )}
          {canEdit && (
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium flex items-center gap-2">
              <Icon name="plus" className="w-5 h-5" /> {t.risks.addRisk}
            </button>
          )}
        </div>
      </div>

      {/* Confidence Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">{t.risks.confidence}</h3>
          <div className={`px-4 py-2 rounded-xl ${avgConfidence >= 3.5 ? 'bg-emerald-500/20 border-emerald-500/50' : avgConfidence >= 2.5 ? 'bg-amber-500/20 border-amber-500/50' : 'bg-red-500/20 border-red-500/50'} border`}>
            <span className="text-sm text-slate-400">{t.risks.avgConfidence}: </span>
            <span className={`text-xl font-bold ${avgConfidence >= 3.5 ? 'text-emerald-400' : avgConfidence >= 2.5 ? 'text-amber-400' : 'text-red-400'}`}>{avgConfidence.toFixed(1)}/5</span>
          </div>
        </div>
        
        {votingActive && <div className="mb-4 p-3 rounded-lg bg-amber-500/20 text-amber-400 text-sm flex items-center gap-2"><Icon name="alert" className="w-5 h-5" /> {t.risks.voting}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="font-medium text-white">{team.name}</span>
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(vote => (
                  <button
                    key={vote}
                    onClick={() => handleVote(team.id, vote)}
                    disabled={!votingActive || !canEdit}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      team.confidence === vote
                        ? vote <= 2 ? 'bg-red-500 text-white' : vote === 3 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    } ${!votingActive ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {vote}
                  </button>
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">
                {team.confidence === 1 && '✊ Cannot commit'}
                {team.confidence === 2 && '☝️ Reservations'}
                {team.confidence === 3 && '✌️ Neutral'}
                {team.confidence === 4 && '🤟 Minor concerns'}
                {team.confidence === 5 && '🖐️ Full confidence'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Risks Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-white mb-4">{t.risks.topRisks}</h3>
        <div className="space-y-3">
          {risks.map(risk => {
            const team = teams.find(t => t.id === risk.teamId);
            return (
              <div key={risk.id} className={`p-4 rounded-xl border ${risk.severity === 'high' ? 'bg-red-500/10 border-red-500/30' : risk.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'default'}>{t.risks[risk.severity]}</Badge>
                      <Badge variant={risk.status === 'resolved' ? 'success' : risk.status === 'mitigated' ? 'info' : 'default'}>{t.risks[risk.status]}</Badge>
                      {team && <Badge><span className="w-2 h-2 rounded-full mr-1 inline-block" style={{ backgroundColor: team.color }} />{team.name}</Badge>}
                    </div>
                    <p className="text-white font-medium">{risk.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{t.risks.owner}: {risk.owner}</p>
                    {risk.mitigation && <p className="text-sm text-slate-500 mt-1">{t.risks.mitigation}: {risk.mitigation}</p>}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1">
                      <select value={risk.status} onChange={e => updateRisk(risk.id, { status: e.target.value })} className="px-2 py-1 rounded bg-slate-700 text-white text-xs border-none">
                        <option value="owned">{t.risks.owned}</option>
                        <option value="accepted">{t.risks.accepted}</option>
                        <option value="mitigated">{t.risks.mitigated}</option>
                        <option value="resolved">{t.risks.resolved}</option>
                      </select>
                      <button onClick={() => deleteRisk(risk.id)} className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400">
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {risks.length === 0 && <p className="text-center text-slate-500 py-4">{t.c.noData}</p>}
        </div>
      </div>

      {/* Add Risk Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.risks.addRisk}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">Description</label>
            <textarea value={newRisk.name} onChange={e => setNewRisk({ ...newRisk, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-2">{t.risks.severity}</label>
              <select value={newRisk.severity} onChange={e => setNewRisk({ ...newRisk, severity: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
                <option value="high">{t.risks.high}</option>
                <option value="medium">{t.risks.medium}</option>
                <option value="low">{t.risks.low}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase mb-2">{t.c.team}</label>
              <select value={newRisk.teamId} onChange={e => setNewRisk({ ...newRisk, teamId: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
                <option value="">All ART</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">{t.risks.owner}</label>
            <input type="text" value={newRisk.owner} onChange={e => setNewRisk({ ...newRisk, owner: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase mb-2">{t.risks.mitigation}</label>
            <textarea value={newRisk.mitigation} onChange={e => setNewRisk({ ...newRisk, mitigation: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white resize-none" rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-slate-400">{t.c.cancel}</button>
            <button onClick={handleAddRisk} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">{t.c.add}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============ SETTINGS & IMPORT ============
const SettingsView = () => {
  const { t, userRole, auditLog, lang, setLang } = useApp();
  const [activeTab, setActiveTab] = useState('import');
  const [csvData, setCsvData] = useState(null);
  const [jiraConfig, setJiraConfig] = useState({ url: '', token: '', project: '' });
  const [importing, setImporting] = useState(false);

  const canImport = ROLES[userRole]?.canImport;

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).filter(l => l.trim()).map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i] }), {});
      });
      setCsvData({ headers, rows });
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setCsvData(null);
      alert(t.import.success);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t.nav.settings}</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {['import', 'audit', 'language'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === tab ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>
            {tab === 'import' && t.import.title}
            {tab === 'audit' && t.audit.title}
            {tab === 'language' && 'Language'}
          </button>
        ))}
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {!canImport ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
              <Icon name="alert" className="w-12 h-12 text-amber-400 mx-auto mb-2" />
              <p className="text-amber-400">{t.c.permissions}</p>
            </div>
          ) : (
            <>
              {/* Jira Import */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔷</span> {t.import.jira}
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-400 uppercase mb-2">{t.import.jiraUrl}</label>
                    <input type="text" value={jiraConfig.url} onChange={e => setJiraConfig({ ...jiraConfig, url: e.target.value })} placeholder="https://company.atlassian.net" className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase mb-2">{t.import.jiraToken}</label>
                    <input type="password" value={jiraConfig.token} onChange={e => setJiraConfig({ ...jiraConfig, token: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 uppercase mb-2">{t.import.jiraProject}</label>
                    <input type="text" value={jiraConfig.project} onChange={e => setJiraConfig({ ...jiraConfig, project: e.target.value })} placeholder="PROJ" className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30">
                  {t.import.fetchItems}
                </button>
              </div>

              {/* CSV Import */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Icon name="upload" className="w-5 h-5" /> {t.import.csv}
                </h3>
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Icon name="upload" className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400">{t.import.selectFile}</p>
                  </label>
                </div>
                
                {csvData && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-400 mb-2">{t.import.preview}: {csvData.rows.length} {t.import.rows}</p>
                    <div className="overflow-x-auto max-h-48 rounded-lg border border-slate-700">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800 sticky top-0">
                          <tr>{csvData.headers.map((h, i) => <th key={i} className="px-3 py-2 text-left text-slate-400">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {csvData.rows.slice(0, 5).map((row, i) => (
                            <tr key={i}>{csvData.headers.map((h, j) => <td key={j} className="px-3 py-2 text-white">{row[h]}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button onClick={handleImport} disabled={importing} className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium disabled:opacity-50">
                      {importing ? t.c.loading : t.import.import}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900 text-xs uppercase text-slate-400">
                <th className="px-4 py-3 text-left">{t.audit.timestamp}</th>
                <th className="px-4 py-3 text-left">{t.audit.user}</th>
                <th className="px-4 py-3 text-left">{t.audit.action}</th>
                <th className="px-4 py-3 text-left">{t.audit.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLog.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-sm text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-white">{log.user}</td>
                  <td className="px-4 py-3">
                    <Badge variant={log.action === 'created' ? 'success' : log.action === 'updated' ? 'warning' : 'danger'}>
                      {t.audit[log.action]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Language / Język</h3>
          <div className="flex gap-4">
            <button onClick={() => setLang('en')} className={`px-6 py-3 rounded-xl font-medium ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'}`}>English</button>
            <button onClick={() => setLang('pl')} className={`px-6 py-3 rounded-xl font-medium ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-slate-800 text-slate-400'}`}>Polski</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ SIMPLIFIED VIEWS ============
const CapacityBoard = () => {
  const { t, teams, items, sprints, absences, updateItem } = useApp();
  const [draggedItem, setDraggedItem] = useState(null);

  const capacityData = useMemo(() => {
    const data = {};
    teams.forEach(team => {
      data[team.id] = {};
      sprints.forEach((sprint, idx) => {
        const sprintNum = idx + 1;
        const cap = sprint.isIP ? team.velocity * 0.2 : team.velocity;
        const demand = items.filter(i => i.teamId === team.id && i.sprint === sprintNum).reduce((s, i) => s + (i.sp || 0), 0);
        data[team.id][sprintNum] = { capacity: cap, demand, load: cap > 0 ? demand / cap : 0, items: items.filter(i => i.teamId === team.id && i.sprint === sprintNum) };
      });
    });
    return data;
  }, [teams, items, sprints]);

  const unassigned = items.filter(i => !i.teamId || !i.sprint);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t.cap.title}</h2>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-900">
              <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase w-40">{t.c.team}</th>
              {sprints.map((s, i) => <th key={i} className="px-2 py-3 text-center text-xs text-slate-400 uppercase min-w-[120px]">{s.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {teams.map(team => (
              <tr key={team.id}>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} /><span className="text-white">{team.name}</span></div></td>
                {sprints.map((sprint, idx) => {
                  const cell = capacityData[team.id][idx + 1];
                  const color = getLoadColor(cell.load);
                  return (
                    <td key={idx} className="px-2 py-2" onDragOver={e => e.preventDefault()} onDrop={e => { if (draggedItem) { updateItem(draggedItem.id, { teamId: team.id, sprint: idx + 1 }); setDraggedItem(null); } }}>
                      <div className={`p-2 rounded-lg ${color.bg} ${color.border} border min-h-[80px]`}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={color.text}>{cell.demand}/{cell.capacity}</span>
                          <span className={color.text}>{(cell.load * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(cell.load * 100, 100)}%`, backgroundColor: color.fill }} />
                        </div>
                        <div className="space-y-1">
                          {cell.items.slice(0, 2).map(item => (
                            <div key={item.id} draggable onDragStart={() => setDraggedItem(item)} className="text-xs p-1 rounded bg-slate-800/50 text-white truncate cursor-move">{item.name}</div>
                          ))}
                          {cell.items.length > 2 && <p className="text-xs text-slate-500">+{cell.items.length - 2}</p>}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-2">{t.cap.unplanned} ({unassigned.length})</h3>
        <div className="flex flex-wrap gap-2">
          {unassigned.map(item => (
            <div key={item.id} draggable onDragStart={() => setDraggedItem(item)} className="px-3 py-2 rounded-lg bg-slate-800 text-white text-sm cursor-move flex items-center gap-2">
              <TypeBadge type={item.type} />{item.name}<Badge variant="info" size="xs">{item.sp}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BacklogView = () => {
  const { t, items, teams, addItem, updateItem, deleteItem, userRole } = useApp();
  const [newItem, setNewItem] = useState({ type: 'feature', name: '', sp: 20, teamId: '', sprint: null });
  const canEdit = ROLES[userRole]?.canEdit;

  const handleAdd = () => {
    if (!newItem.name) return;
    addItem({ ...newItem, id: uid() });
    setNewItem({ type: 'feature', name: '', sp: 20, teamId: '', sprint: null });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t.backlog.title}</h2>
      {canEdit && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex gap-2">
          <select value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
            {Object.entries(ITEM_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder={t.backlog.name} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
          <select value={newItem.sp} onChange={e => setNewItem({ ...newItem, sp: parseInt(e.target.value) })} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white w-24">
            {[1,2,3,5,8,13,20,40].map(sp => <option key={sp} value={sp}>{sp} SP</option>)}
          </select>
          <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Icon name="plus" className="w-5 h-5" /></button>
        </div>
      )}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-slate-900 text-xs uppercase text-slate-400"><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-left">{t.backlog.name}</th><th className="px-4 py-3 text-center">{t.c.sp}</th><th className="px-4 py-3 text-center">{t.c.team}</th><th className="px-4 py-3 text-center">{t.c.sprint}</th><th className="px-4 py-3"></th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/30">
                <td className="px-4 py-3"><TypeBadge type={item.type} /></td>
                <td className="px-4 py-3 text-white">{item.name}</td>
                <td className="px-4 py-3 text-center"><Badge variant="info">{item.sp}</Badge></td>
                <td className="px-4 py-3 text-center">{teams.find(t => t.id === item.teamId)?.name || '—'}</td>
                <td className="px-4 py-3 text-center">{item.sprint ? `S${item.sprint}` : '—'}</td>
                <td className="px-4 py-3 text-center">{canEdit && <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"><Icon name="trash" className="w-4 h-4" /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TeamsView = () => {
  const { t, teams, sprints, absences, updateTeam, addTeam, deleteTeam, updateAbsence, userRole } = useApp();
  const [newTeam, setNewTeam] = useState({ name: '', color: '#22d3ee', velocity: 40 });
  const canEdit = ROLES[userRole]?.canEdit;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t.teams.title}</h2>
      {teams.map(team => (
        <div key={team.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="color" value={team.color} onChange={e => canEdit && updateTeam(team.id, { color: e.target.value })} disabled={!canEdit} className="w-10 h-10 rounded-lg cursor-pointer" />
              <input type="text" value={team.name} onChange={e => canEdit && updateTeam(team.id, { name: e.target.value })} disabled={!canEdit} className="text-lg font-semibold text-white bg-transparent border-none" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">{t.teams.velocity}:</span>
              <input type="number" value={team.velocity} onChange={e => canEdit && updateTeam(team.id, { velocity: parseInt(e.target.value) })} disabled={!canEdit} className="w-20 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-center" />
              {canEdit && <button onClick={() => deleteTeam(team.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400"><Icon name="trash" className="w-5 h-5" /></button>}
            </div>
          </div>
          <div className="p-4">
            <h4 className="text-sm text-slate-400 mb-2">{t.teams.absences}</h4>
            <table className="w-full text-sm">
              <thead><tr className="text-slate-400"><th className="text-left py-1">Member</th>{sprints.map((s, i) => <th key={i} className="text-center py-1">{s.name}</th>)}</tr></thead>
              <tbody>
                {team.members.map(m => (
                  <tr key={m.id}>
                    <td className="py-1 text-white">{m.name} ({m.fte} FTE)</td>
                    {sprints.map((s, i) => (
                      <td key={i} className="text-center py-1">
                        <input type="number" value={absences[`${team.id}-${m.id}-${i + 1}`] || 0} onChange={e => canEdit && updateAbsence(team.id, m.id, i + 1, parseInt(e.target.value) || 0)} disabled={!canEdit} min="0" max={s.workDays} className="w-12 px-2 py-1 rounded bg-slate-800 text-white text-center text-sm border border-slate-700" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {canEdit && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex gap-2">
          <input type="text" value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} placeholder={t.teams.teamName} className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
          <input type="color" value={newTeam.color} onChange={e => setNewTeam({ ...newTeam, color: e.target.value })} className="w-10 h-10 rounded-lg" />
          <input type="number" value={newTeam.velocity} onChange={e => setNewTeam({ ...newTeam, velocity: parseInt(e.target.value) })} className="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center" />
          <button onClick={() => { if (newTeam.name) { addTeam({ ...newTeam, id: uid(), members: [], confidence: 3, historicalVelocity: [newTeam.velocity] }); setNewTeam({ name: '', color: '#22d3ee', velocity: 40 }); } }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white">{t.c.add}</button>
        </div>
      )}
    </div>
  );
};

const ProgramBoard = () => {
  const { t, teams, items, sprints, milestones, dependencies } = useApp();
  const features = items.filter(i => i.type === 'feature' || i.type === 'enabler');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{t.program.title}</h2>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b border-slate-700">
            <div className="w-32 shrink-0 p-3 bg-slate-900" />
            {sprints.map((s, i) => (
              <div key={i} className="flex-1 min-w-[120px] p-3 text-center border-l border-slate-700">
                <p className={`font-semibold ${s.isIP ? 'text-purple-400' : 'text-white'}`}>{s.name}</p>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {milestones.filter(m => m.sprint === i + 1).map(m => (
                    <span key={m.id} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${m.color}20`, color: m.color }}>◆ {m.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {teams.map(team => (
            <div key={team.id} className="flex border-b border-slate-700">
              <div className="w-32 shrink-0 p-3 bg-slate-900/50 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <span className="text-white text-sm">{team.name}</span>
              </div>
              {sprints.map((s, i) => {
                const sprintItems = features.filter(f => f.teamId === team.id && f.sprint === i + 1);
                return (
                  <div key={i} className="flex-1 min-w-[120px] p-2 border-l border-slate-700">
                    {sprintItems.map(item => {
                      const hasDep = dependencies.some(d => d.fromId === item.id || d.toId === item.id);
                      return (
                        <div key={item.id} className={`p-2 mb-1 rounded text-xs bg-slate-800/50 ${hasDep ? 'border border-cyan-500/50' : ''}`}>
                          {hasDep && <span className="text-cyan-400 mr-1">⛓</span>}
                          <span className="text-white">{item.name}</span>
                          <span className="text-slate-400 ml-1">{item.sp}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('rte');
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('pl');
  const [view, setView] = useState('dashboard');
  const [pi, setPi] = useState('PI44');
  const [teams, setTeams] = useState([]);
  const [items, setItems] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [risks, setRisks] = useState([]);
  const [absences, setAbsences] = useState({});
  const [milestones, setMilestones] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  
  const t = T[lang];
  const sprints = useMemo(() => calculateSprints(PI_CONFIG[pi]), [pi]);

  useEffect(() => { setLoading(false); }, []);

  const handleDemo = (role, selectedLang) => {
    const demo = createDemoData();
    setTeams(demo.teams);
    setItems(demo.items);
    setDependencies(demo.dependencies);
    setRisks(demo.risks);
    setAbsences(demo.absences);
    setMilestones(demo.milestones);
    setAuditLog(demo.auditLog);
    setUserRole(role);
    setLang(selectedLang);
    setIsDemo(true);
    setUser({ email: 'demo@pi-planner.app', role });
  };

  const addAuditEntry = (action, entity, entityId, details) => {
    setAuditLog(prev => [{ id: uid(), user: user?.email, action, entity, entityId, timestamp: new Date().toISOString(), details }, ...prev]);
  };

  const updateTeam = (id, upd) => { setTeams(prev => prev.map(t => t.id === id ? { ...t, ...upd } : t)); addAuditEntry('updated', 'Team', id, `Updated ${Object.keys(upd).join(', ')}`); };
  const addTeam = (team) => { setTeams(prev => [...prev, team]); addAuditEntry('created', 'Team', team.id, `Created ${team.name}`); };
  const deleteTeam = (id) => { setTeams(prev => prev.filter(t => t.id !== id)); addAuditEntry('deleted', 'Team', id, 'Deleted team'); };
  const updateItem = (id, upd) => { setItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i)); addAuditEntry('updated', 'Item', id, `Updated ${Object.keys(upd).join(', ')}`); };
  const addItem = (item) => { setItems(prev => [...prev, item]); addAuditEntry('created', 'Item', item.id, `Created ${item.name}`); };
  const deleteItem = (id) => { setItems(prev => prev.filter(i => i.id !== id)); addAuditEntry('deleted', 'Item', id, 'Deleted item'); };
  const addDependency = (dep) => { setDependencies(prev => [...prev, dep]); addAuditEntry('created', 'Dependency', dep.id, 'Created dependency'); };
  const updateDependency = (id, upd) => { setDependencies(prev => prev.map(d => d.id === id ? { ...d, ...upd } : d)); };
  const deleteDependency = (id) => { setDependencies(prev => prev.filter(d => d.id !== id)); addAuditEntry('deleted', 'Dependency', id, 'Deleted dependency'); };
  const addRisk = (risk) => { setRisks(prev => [...prev, risk]); addAuditEntry('created', 'Risk', risk.id, `Created ${risk.name}`); };
  const updateRisk = (id, upd) => { setRisks(prev => prev.map(r => r.id === id ? { ...r, ...upd } : r)); };
  const deleteRisk = (id) => { setRisks(prev => prev.filter(r => r.id !== id)); addAuditEntry('deleted', 'Risk', id, 'Deleted risk'); };
  const updateAbsence = (teamId, memberId, sprint, days) => { setAbsences(prev => ({ ...prev, [`${teamId}-${memberId}-${sprint}`]: days })); };

  const ctx = { t, lang, setLang, teams, items, sprints, absences, milestones, dependencies, risks, auditLog, pi, setPi, userRole, user, isDemo, updateTeam, addTeam, deleteTeam, updateItem, addItem, deleteItem, addDependency, updateDependency, deleteDependency, addRisk, updateRisk, deleteRisk, updateAbsence };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  if (!user && !isDemo) return <AuthScreen onDemo={handleDemo} />;

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: t.nav.dashboard },
    { id: 'capacity', icon: 'capacity', label: t.nav.capacity },
    { id: 'backlog', icon: 'backlog', label: t.nav.backlog },
    { id: 'teams', icon: 'teams', label: t.nav.teams },
    { id: 'program', icon: 'program', label: t.nav.program },
    { id: 'dependencies', icon: 'link', label: t.deps.title },
    { id: 'whatif', icon: 'whatif', label: t.nav.whatif },
    { id: 'risks', icon: 'risks', label: t.nav.risks },
    { id: 'settings', icon: 'settings', label: t.nav.settings },
  ];

  const views = { dashboard: RTEDashboard, capacity: CapacityBoard, backlog: BacklogView, teams: TeamsView, program: ProgramBoard, dependencies: DependenciesView, whatif: WhatIfView, risks: RisksView, settings: SettingsView };
  const ViewComponent = views[view] || RTEDashboard;

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`}</style>
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20"><span className="text-xl font-bold text-white">π</span></div>
              <div><h1 className="text-lg font-semibold text-white">{t.app.title}</h1><p className="text-xs text-slate-400">{t.app.subtitle}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <select value={pi} onChange={e => setPi(e.target.value)} className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm">
                {Object.entries(PI_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
              <Badge variant={userRole === 'admin' ? 'danger' : userRole === 'rte' ? 'purple' : 'default'}>{t.auth[userRole]}</Badge>
              {isDemo && <Badge variant="warning">DEMO</Badge>}
              <button onClick={() => { setUser(null); setIsDemo(false); }} className="text-sm text-slate-400 hover:text-red-400">{t.auth.signOut}</button>
            </div>
          </div>
        </header>
        <div className="max-w-[1800px] mx-auto flex">
          <nav className="w-56 shrink-0 p-4 sticky top-20 h-[calc(100vh-80px)]">
            <div className="space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${view === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                  <Icon name={item.icon} className="w-5 h-5" /><span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
          <main className="flex-1 p-6 min-h-[calc(100vh-80px)]"><ViewComponent /></main>
        </div>
      </div>
    </AppContext.Provider>
  );
}
