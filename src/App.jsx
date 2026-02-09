import React, { useState, useMemo, createContext, useContext, useEffect, useCallback } from 'react';
import { supabase, auth, db, realtime, isConfigured } from './supabase.js';

const AppContext = createContext();
const useApp = () => useContext(AppContext);

const T = {
  en: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Enterprise Planning Suite' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', backlog: 'Backlog', objectives: 'PI Objectives', risks: 'ROAM Board', voting: 'Confidence Vote', settings: 'Settings', history: 'History' },
    auth: { signIn: 'Sign In', signUp: 'Sign Up', signOut: 'Sign Out', email: 'Email', password: 'Password', name: 'Full Name', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', demoMode: 'Demo Mode', configureSupabase: 'Configure Supabase in .env' },
    dash: { title: 'PI Dashboard', calDays: 'Calendar Days', workDays: 'Working Days', teamCap: 'Team Capacity', allocated: 'Allocated', util: 'Utilization', features: 'Features', risks: 'Open Risks', epics: 'Epics', stories: 'Stories' },
    cap: { title: 'Capacity Planning', max: 'Max Capacity', net: 'Net Capacity', abs: 'Absences', warn: 'Warning: Over 80%', danger: 'Over capacity!' },
    board: { title: 'Program Board', addFeat: 'Add Feature', name: 'Name', sp: 'Story Points', bv: 'Business Value', status: 'Status', notStarted: 'Not Started', inProgress: 'In Progress', done: 'Done', blocked: 'Blocked', healthy: 'Healthy', atRisk: 'At Risk', violated: 'Violated', miles: 'Milestones', teams: 'Teams', assignee: 'Assignee', selectTeam: 'Select team', selectPerson: 'Select person', desc: 'Description', ac: 'Acceptance Criteria', epic: 'Epic', feature: 'Feature', story: 'Story', parent: 'Parent', children: 'Children', autoSuggest: 'Auto-suggest', generateAC: 'Generate AC with AI', suggestSprint: 'Suggest Sprint', suggestAssignee: 'Suggest Assignee', breakdownStories: 'Breakdown to Stories', unassigned: 'Unassigned' },
    obj: { title: 'PI Objectives', committed: 'Committed', uncommitted: 'Uncommitted', add: 'Add Objective', predict: 'Predictability Measure', target: 'Target: 80-100%', actual: 'Actual' },
    risk: { title: 'ROAM Board', resolved: 'Resolved', owned: 'Owned', accepted: 'Accepted', mitigated: 'Mitigated', add: 'Add Risk', owner: 'Owner', severity: 'Severity', high: 'High', medium: 'Medium', low: 'Low', due: 'Due Date', feature: 'Linked Feature', none: 'No risks' },
    vote: { title: 'Confidence Vote', fof: 'Fist of Five', start: 'Start Voting', end: 'End Voting', your: 'Your Vote', avg: 'Average', dist: 'Distribution', noVotes: 'No votes yet', exp: { 5: 'Full confidence', 4: 'Minor concerns', 3: 'Neutral', 2: 'Reservations', 1: 'Cannot commit' } },
    set: { title: 'Settings', lang: 'Language', editTeams: 'Edit Teams & Members', addTeam: 'Add Team', addMember: 'Add Member', teamName: 'Team Name', velocity: 'Velocity', autoFeatures: 'Automation Settings', autoStatus: 'Auto-propagate status', autoSP: 'Auto-aggregate SP', autoSuggest: 'Show auto-suggestions' },
    hist: { title: 'Change History', table: 'Table', action: 'Action', user: 'User', time: 'Time', insert: 'Created', update: 'Updated', delete: 'Deleted' },
    backlog: { title: 'Backlog', epics: 'Epics', features: 'Features', stories: 'Stories', addEpic: 'Add Epic', addFeature: 'Add Feature', addStory: 'Add Story', hierarchy: 'Hierarchy View', flat: 'Flat View', filter: 'Filter', all: 'All', unplanned: 'Unplanned' },
    auto: { suggested: 'Suggested', sprint: 'Suggested Sprint', assignee: 'Suggested Assignee', reason: 'Reason', accept: 'Accept', generating: 'Generating...', acGenerated: 'AC generated', storiesGenerated: 'Stories generated' },
    c: { save: 'Save', cancel: 'Cancel', delete: 'Delete', add: 'Add', close: 'Close', total: 'Total', md: 'MD', sp: 'SP', sprint: 'Sprint', team: 'Team', none: 'None', noData: 'No data', loading: 'Loading...', members: 'members', velocity: 'Velocity', ip: 'IP Sprint', synced: 'Synced', type: 'Type' },
  },
  pl: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Narzędzie Planowania' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', backlog: 'Backlog', objectives: 'Cele PI', risks: 'ROAM Board', voting: 'Głosowanie', settings: 'Ustawienia', history: 'Historia' },
    auth: { signIn: 'Zaloguj', signUp: 'Rejestracja', signOut: 'Wyloguj', email: 'Email', password: 'Hasło', name: 'Imię i nazwisko', noAccount: 'Nie masz konta?', hasAccount: 'Masz już konto?', demoMode: 'Tryb Demo', configureSupabase: 'Skonfiguruj Supabase w .env' },
    dash: { title: 'Dashboard PI', calDays: 'Dni kalendarzowe', workDays: 'Dni robocze', teamCap: 'Capacity zespołu', allocated: 'Przydzielone', util: 'Wykorzystanie', features: 'Features', risks: 'Otwarte ryzyka', epics: 'Epiki', stories: 'Stories' },
    cap: { title: 'Planowanie Capacity', max: 'Max Capacity', net: 'Capacity netto', abs: 'Nieobecności', warn: 'Uwaga: Ponad 80%', danger: 'Przekroczenie!' },
    board: { title: 'Program Board', addFeat: 'Dodaj Feature', name: 'Nazwa', sp: 'Story Points', bv: 'Wartość biznesowa', status: 'Status', notStarted: 'Nie rozpoczęte', inProgress: 'W trakcie', done: 'Zakończone', blocked: 'Zablokowane', healthy: 'Zdrowa', atRisk: 'Zagrożona', violated: 'Naruszona', miles: 'Kamienie milowe', teams: 'Zespoły', assignee: 'Realizuje', selectTeam: 'Wybierz zespół', selectPerson: 'Wybierz osobę', desc: 'Opis', ac: 'Acceptance Criteria', epic: 'Epic', feature: 'Feature', story: 'Story', parent: 'Rodzic', children: 'Dzieci', autoSuggest: 'Auto-sugestia', generateAC: 'Generuj AC z AI', suggestSprint: 'Sugeruj Sprint', suggestAssignee: 'Sugeruj osobę', breakdownStories: 'Rozbij na Stories', unassigned: 'Nieprzypisane' },
    obj: { title: 'Cele PI', committed: 'Zobowiązane', uncommitted: 'Stretch', add: 'Dodaj cel', predict: 'Miara przewidywalności', target: 'Cel: 80-100%', actual: 'Rzeczywista' },
    risk: { title: 'ROAM Board', resolved: 'Rozwiązane', owned: 'Z właścicielem', accepted: 'Zaakceptowane', mitigated: 'Zmitigowane', add: 'Dodaj ryzyko', owner: 'Właściciel', severity: 'Ważność', high: 'Wysoka', medium: 'Średnia', low: 'Niska', due: 'Termin', feature: 'Powiązany Feature', none: 'Brak ryzyk' },
    vote: { title: 'Głosowanie', fof: 'Fist of Five', start: 'Rozpocznij', end: 'Zakończ', your: 'Twój głos', avg: 'Średnia', dist: 'Rozkład', noVotes: 'Brak głosów', exp: { 5: 'Pełne zaufanie', 4: 'Drobne obawy', 3: 'Neutralny', 2: 'Zastrzeżenia', 1: 'Nie mogę' } },
    set: { title: 'Ustawienia', lang: 'Język', editTeams: 'Edytuj zespoły i osoby', addTeam: 'Dodaj zespół', addMember: 'Dodaj osobę', teamName: 'Nazwa zespołu', velocity: 'Velocity', autoFeatures: 'Ustawienia automatyzacji', autoStatus: 'Auto-propagacja statusu', autoSP: 'Auto-agregacja SP', autoSuggest: 'Pokazuj sugestie' },
    hist: { title: 'Historia zmian', table: 'Tabela', action: 'Akcja', user: 'Użytkownik', time: 'Czas', insert: 'Utworzono', update: 'Zaktualizowano', delete: 'Usunięto' },
    backlog: { title: 'Backlog', epics: 'Epiki', features: 'Features', stories: 'Stories', addEpic: 'Dodaj Epic', addFeature: 'Dodaj Feature', addStory: 'Dodaj Story', hierarchy: 'Widok hierarchii', flat: 'Widok płaski', filter: 'Filtruj', all: 'Wszystkie', unplanned: 'Nieplanowane' },
    auto: { suggested: 'Sugerowane', sprint: 'Sugerowany Sprint', assignee: 'Sugerowana osoba', reason: 'Powód', accept: 'Akceptuj', generating: 'Generowanie...', acGenerated: 'AC wygenerowane', storiesGenerated: 'Stories wygenerowane' },
    c: { save: 'Zapisz', cancel: 'Anuluj', delete: 'Usuń', add: 'Dodaj', close: 'Zamknij', total: 'Suma', md: 'MD', sp: 'SP', sprint: 'Sprint', team: 'Zespół', none: 'Brak', noData: 'Brak danych', loading: 'Ładowanie...', members: 'członków', velocity: 'Velocity', ip: 'IP Sprint', synced: 'Zsynchronizowano', type: 'Typ' },
  },
};

const HOLIDAYS = ['2025-01-01','2025-01-06','2025-04-20','2025-04-21','2025-05-01','2025-05-03','2025-06-08','2025-06-19','2025-08-15','2025-11-01','2025-11-11','2025-12-25','2025-12-26'];
const PI_PRESETS = { PI43: { s: '2025-01-08', e: '2025-02-18' }, PI44: { s: '2025-02-19', e: '2025-04-29' }, PI45: { s: '2025-04-30', e: '2025-07-08' }, PI46: { s: '2025-07-09', e: '2025-09-16' }, PI47: { s: '2025-09-17', e: '2025-11-25' }, PI48: { s: '2025-11-26', e: '2026-02-03' } };
const ITEM_TYPES = { EPIC: 'epic', FEATURE: 'feature', STORY: 'story' };
const STATUS_ORDER = { blocked: 0, notStarted: 1, inProgress: 2, done: 3 };

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

// Demo data with hierarchy
const demoTeams = [
  { id: 'team1', name: 'Team Alpha', color: '#22d3ee', velocity: 40, team_members: [{ id: 't1m1', name: 'Anna Kowalska', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m2', name: 'Jan Nowak', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m3', name: 'Maria Wiśniewska', fte: 1, role: 'Developer', team_id: 'team1' }, { id: 't1m4', name: 'Piotr Zieliński', fte: 1, role: 'QA', team_id: 'team1' }] },
  { id: 'team2', name: 'Team Beta', color: '#34d399', velocity: 35, team_members: [{ id: 't2m1', name: 'Katarzyna Lewandowska', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m2', name: 'Tomasz Wójcik', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m3', name: 'Agnieszka Kamińska', fte: 1, role: 'Developer', team_id: 'team2' }, { id: 't2m4', name: 'Michał Szymański', fte: 1, role: 'QA', team_id: 'team2' }] },
];

const demoItems = [
  // Epics
  { id: 'e1', type: 'epic', name: 'User Management Platform', description: 'Complete user management system with auth, profiles, and permissions', story_points: 0, team_id: null, assignee_id: null, sprint: null, status: 'inProgress', business_value: 9, parent_id: null, acceptance_criteria: '- Users can register and login\n- Profile management available\n- Role-based access control' },
  { id: 'e2', type: 'epic', name: 'Analytics Dashboard', description: 'Real-time analytics and reporting platform', story_points: 0, team_id: null, assignee_id: null, sprint: null, status: 'notStarted', business_value: 8, parent_id: null, acceptance_criteria: '- Real-time data updates\n- Export functionality\n- Custom date ranges' },
  // Features (linked to Epics)
  { id: 'f1', type: 'feature', name: 'User Authentication System', description: 'OAuth2 and email/password authentication', story_points: 40, team_id: 'team1', assignee_id: 't1m1', sprint: 1, status: 'inProgress', business_value: 8, parent_id: 'e1', acceptance_criteria: '- OAuth2 with Google/GitHub\n- Email verification\n- Password reset flow\n- Session management' },
  { id: 'f2', type: 'feature', name: 'User Profile Management', description: 'Profile CRUD operations', story_points: 20, team_id: 'team1', assignee_id: 't1m2', sprint: 2, status: 'notStarted', business_value: 7, parent_id: 'e1', acceptance_criteria: '- View/edit profile\n- Avatar upload\n- Privacy settings' },
  { id: 'f3', type: 'feature', name: 'API Integration Layer', description: 'RESTful API with versioning', story_points: 40, team_id: 'team2', assignee_id: 't2m1', sprint: 1, status: 'inProgress', business_value: 9, parent_id: 'e2', acceptance_criteria: '- REST endpoints\n- API versioning\n- Rate limiting\n- Documentation' },
  { id: 'f4', type: 'feature', name: 'Reporting Module', description: 'Generate and export reports', story_points: 20, team_id: 'team2', assignee_id: null, sprint: 3, status: 'notStarted', business_value: 6, parent_id: 'e2', acceptance_criteria: '' },
  // Stories (linked to Features)
  { id: 's1', type: 'story', name: 'Implement OAuth2 flow', description: 'Setup OAuth2 with providers', story_points: 8, team_id: 'team1', assignee_id: 't1m1', sprint: 1, status: 'inProgress', business_value: 8, parent_id: 'f1', acceptance_criteria: '- Google OAuth works\n- GitHub OAuth works\n- Tokens stored securely' },
  { id: 's2', type: 'story', name: 'Email verification', description: 'Send verification emails', story_points: 5, team_id: 'team1', assignee_id: 't1m3', sprint: 1, status: 'notStarted', business_value: 7, parent_id: 'f1', acceptance_criteria: '- Email sent on registration\n- Verification link works\n- Resend option available' },
  { id: 's3', type: 'story', name: 'Password reset', description: 'Forgot password flow', story_points: 5, team_id: 'team1', assignee_id: 't1m4', sprint: 2, status: 'notStarted', business_value: 7, parent_id: 'f1', acceptance_criteria: '- Reset email sent\n- Secure token\n- Password updated' },
  { id: 's4', type: 'story', name: 'REST endpoints setup', description: 'Basic CRUD endpoints', story_points: 13, team_id: 'team2', assignee_id: 't2m1', sprint: 1, status: 'inProgress', business_value: 9, parent_id: 'f3', acceptance_criteria: '- GET/POST/PUT/DELETE\n- Proper status codes\n- JSON responses' },
  { id: 's5', type: 'story', name: 'API documentation', description: 'Swagger/OpenAPI docs', story_points: 5, team_id: 'team2', assignee_id: 't2m2', sprint: 2, status: 'notStarted', business_value: 6, parent_id: 'f3', acceptance_criteria: '- Swagger UI available\n- All endpoints documented\n- Examples included' },
];

const demoDeps = [{ id: 'd1', provider_id: 'f3', consumer_id: 'f1', provider_sprint: 1, consumer_sprint: 2 }];
const demoObjectives = [
  { id: 'o1', name: 'Deliver core authentication flow', committed: true, business_value: 9, planned_value: 9, actual_value: null, status: 'inProgress', team_id: 'team1' },
  { id: 'o2', name: 'Complete API integration framework', committed: true, business_value: 8, planned_value: 8, actual_value: null, status: 'inProgress', team_id: 'team2' },
];
const demoRisks = [{ id: 'r1', name: 'Third-party API rate limits', status: 'owned', severity: 'medium', owner_id: 't2m1', due_date: '2025-03-15', feature_id: 'f3' }];
const demoMilestones = [{ id: 'm1', name: 'MVP Release', sprint: 3, color: '#f59e0b' }, { id: 'm2', name: 'Beta Launch', sprint: 5, color: '#8b5cf6' }];

// ============ AUTOMATION ENGINE ============
const AutomationEngine = {
  // Calculate aggregated status for parent (worst child status)
  calculateParentStatus: (children) => {
    if (!children.length) return 'notStarted';
    const statuses = children.map(c => c.status);
    if (statuses.includes('blocked')) return 'blocked';
    if (statuses.every(s => s === 'done')) return 'done';
    if (statuses.some(s => s === 'inProgress' || s === 'done')) return 'inProgress';
    return 'notStarted';
  },

  // Calculate aggregated SP for parent (sum of children)
  calculateParentSP: (children) => {
    return children.reduce((sum, c) => sum + (c.story_points || 0), 0);
  },

  // Suggest best sprint based on capacity and dependencies
  suggestSprint: (item, items, teams, deps, sprints, absences) => {
    const team = teams.find(t => t.id === item.team_id);
    if (!team) return { sprint: 1, reason: 'No team assigned' };

    // Check dependencies - must be after provider sprints
    const consumingDeps = deps.filter(d => d.consumer_id === item.id);
    let minSprint = 1;
    consumingDeps.forEach(dep => {
      const provider = items.find(i => i.id === dep.provider_id);
      if (provider?.sprint) {
        minSprint = Math.max(minSprint, provider.sprint + 1);
      }
    });

    // Find sprint with most available capacity
    const members = team.team_members || [];
    const sprintCaps = sprints.map((sp, idx) => {
      const sn = idx + 1;
      if (sn < minSprint) return { sprint: sn, available: -1, reason: 'Dependency constraint' };
      
      let totalCap = 0;
      members.forEach(m => {
        const abs = absences[`${team.id}-${m.id}-${sn}`] || 0;
        totalCap += (sp.netDays - abs) * (m.fte || 1);
      });
      
      const allocated = items
        .filter(i => i.team_id === team.id && i.sprint === sn && i.type !== 'epic')
        .reduce((sum, i) => sum + (i.story_points || 0) / 4, 0); // SP to MD conversion
      
      return { sprint: sn, available: totalCap - allocated, reason: `${(totalCap - allocated).toFixed(0)} MD available` };
    });

    const validSprints = sprintCaps.filter(s => s.available >= 0);
    if (!validSprints.length) return { sprint: minSprint, reason: 'Dependency constraint' };
    
    const best = validSprints.reduce((a, b) => a.available > b.available ? a : b);
    return { sprint: best.sprint, reason: best.reason };
  },

  // Suggest best assignee based on workload
  suggestAssignee: (item, items, teams, absences, sprints) => {
    const team = teams.find(t => t.id === item.team_id);
    if (!team || !team.team_members?.length) return { assignee: null, reason: 'No team members' };

    const sprint = item.sprint || 1;
    const sprintData = sprints[sprint - 1];
    if (!sprintData) return { assignee: team.team_members[0]?.id, reason: 'Default assignment' };

    const memberLoads = team.team_members.map(m => {
      const abs = absences[`${team.id}-${m.id}-${sprint}`] || 0;
      const capacity = (sprintData.netDays - abs) * (m.fte || 1);
      
      const allocated = items
        .filter(i => i.assignee_id === m.id && i.sprint === sprint)
        .reduce((sum, i) => sum + (i.story_points || 0) / 4, 0);
      
      return { id: m.id, name: m.name, available: capacity - allocated, role: m.role };
    });

    // Prefer developers for features/stories
    const devs = memberLoads.filter(m => m.role === 'Developer');
    const candidates = devs.length ? devs : memberLoads;
    
    const best = candidates.reduce((a, b) => a.available > b.available ? a : b);
    return { assignee: best.id, name: best.name, reason: `${best.available.toFixed(0)} MD available` };
  },

  // Generate acceptance criteria (mock - in real app would call AI)
  generateAcceptanceCriteria: async (item) => {
    // Simulated AI generation based on item name
    await new Promise(r => setTimeout(r, 500)); // Simulate API call
    
    const templates = {
      auth: ['User can authenticate successfully', 'Invalid credentials show error', 'Session persists across page refresh', 'Logout clears session'],
      api: ['Endpoint returns correct status codes', 'Response follows schema', 'Authentication required', 'Rate limiting applied'],
      profile: ['User can view their profile', 'User can edit their profile', 'Changes are persisted', 'Validation errors displayed'],
      report: ['Report generates correctly', 'Export to CSV works', 'Export to PDF works', 'Filters apply correctly'],
      default: ['Feature works as expected', 'Error handling in place', 'Tests pass', 'Documentation updated']
    };

    const name = item.name.toLowerCase();
    let criteria = templates.default;
    if (name.includes('auth') || name.includes('login') || name.includes('password')) criteria = templates.auth;
    else if (name.includes('api') || name.includes('endpoint')) criteria = templates.api;
    else if (name.includes('profile') || name.includes('user')) criteria = templates.profile;
    else if (name.includes('report') || name.includes('export')) criteria = templates.report;

    return criteria.map(c => `- ${c}`).join('\n');
  },

  // Generate story breakdown (mock - in real app would call AI)
  generateStoryBreakdown: async (feature) => {
    await new Promise(r => setTimeout(r, 800)); // Simulate API call
    
    const name = feature.name.toLowerCase();
    const stories = [];
    
    if (name.includes('auth')) {
      stories.push({ name: 'Setup authentication provider', sp: 5 });
      stories.push({ name: 'Implement login flow', sp: 8 });
      stories.push({ name: 'Implement logout flow', sp: 3 });
      stories.push({ name: 'Add session management', sp: 5 });
      stories.push({ name: 'Write authentication tests', sp: 3 });
    } else if (name.includes('api')) {
      stories.push({ name: 'Design API schema', sp: 3 });
      stories.push({ name: 'Implement CRUD endpoints', sp: 8 });
      stories.push({ name: 'Add validation layer', sp: 5 });
      stories.push({ name: 'Implement error handling', sp: 3 });
      stories.push({ name: 'Write API documentation', sp: 3 });
    } else {
      stories.push({ name: `${feature.name} - Backend`, sp: Math.ceil(feature.story_points * 0.4) });
      stories.push({ name: `${feature.name} - Frontend`, sp: Math.ceil(feature.story_points * 0.4) });
      stories.push({ name: `${feature.name} - Tests`, sp: Math.ceil(feature.story_points * 0.2) });
    }
    
    return stories;
  }
};

// Components
const Badge = ({ children, v = 'default', s = 'sm' }) => {
  const vars = { default: 'bg-slate-700 text-slate-300', success: 'bg-emerald-500/20 text-emerald-400', warning: 'bg-amber-500/20 text-amber-400', danger: 'bg-red-500/20 text-red-400', info: 'bg-cyan-500/20 text-cyan-400', purple: 'bg-purple-500/20 text-purple-400' };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center rounded-full font-medium ${vars[v]} ${sizes[s]}`}>{children}</span>;
};

const Icon = ({ name, className = 'w-5 h-5' }) => {
  const paths = { dash: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', cap: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', board: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2', target: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', risk: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', vote: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11', settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', history: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', plus: 'M12 4v16m8-8H4', x: 'M6 18L18 6M6 6l12 12', check: 'M5 13l4 4L19 7', user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', list: 'M4 6h16M4 10h16M4 14h16M4 18h16', folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', spark: 'M13 10V3L4 14h7v7l9-11h-7z', link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', chevDown: 'M19 9l-7 7-7-7', chevRight: 'M9 5l7 7-7 7' };
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

const TypeBadge = ({ type }) => {
  const config = { epic: { color: 'purple', label: 'Epic' }, feature: { color: 'info', label: 'Feature' }, story: { color: 'success', label: 'Story' } };
  const c = config[type] || config.feature;
  return <Badge v={c.color} s="xs">{c.label}</Badge>;
};

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
  const { t, teams, items, risks, sprints, piSum, pi } = useApp();
  const epics = items.filter(i => i.type === 'epic');
  const features = items.filter(i => i.type === 'feature');
  const stories = items.filter(i => i.type === 'story');
  const totalCap = useMemo(() => teams.reduce((s, tm) => s + (tm.team_members || []).reduce((ms, m) => ms + sprints.reduce((ss, sp) => ss + sp.netDays, 0) * (m.fte || 1), 0), 0), [teams, sprints]);
  const allocSP = features.reduce((s, f) => s + (f.story_points || 0), 0);
  const openRisks = risks.filter(r => r.status !== 'resolved').length;
  
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.dash.title} — {pi}</h2>
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
          const tmFeats = features.filter(f => f.team_id === tm.id);
          const tmSP = tmFeats.reduce((s, f) => s + (f.story_points || 0), 0);
          return <div key={tm.id} className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: tm.color }} /><span className="font-medium text-white">{tm.name}</span></div>
              <Badge v="info">{tmSP} SP</Badge>
            </div>
            <Bar val={tmSP} max={tm.velocity * 5} />
            <div className="flex justify-between mt-2 text-xs text-slate-400"><span>{(tm.team_members || []).length} {t.c.members}</span><span>{t.c.velocity}: {tm.velocity} SP/sprint</span></div>
          </div>;
        })}
      </div>
    </div>
  </div>;
};

// Backlog View with Hierarchy
const Backlog = () => {
  const { t, items, teams, allMembers, addItem, updateItem, deleteItem, deps, sprints, absences, settings } = useApp();
  const [viewMode, setViewMode] = useState('hierarchy');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState({});
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(null);

  const epics = items.filter(i => i.type === 'epic');
  const features = items.filter(i => i.type === 'feature');
  const stories = items.filter(i => i.type === 'story');

  const getChildren = (parentId) => items.filter(i => i.parent_id === parentId);
  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'unplanned') return items.filter(i => !i.sprint && i.type !== 'epic');
    return items;
  }, [items, filter]);

  const HierarchyItem = ({ item, level = 0 }) => {
    const children = getChildren(item.id);
    const isExpanded = expanded[item.id];
    const team = teams.find(t => t.id === item.team_id);
    const assignee = allMembers.find(m => m.id === item.assignee_id);
    const statusColors = { notStarted: 'slate', inProgress: 'cyan', done: 'emerald', blocked: 'red' };
    
    return <div>
      <div className={`flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer ml-${level * 4}`} onClick={() => setSelItem(item)}>
        {children.length > 0 ? (
          <button onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }} className="p-1 hover:bg-slate-700 rounded">
            <Icon name={isExpanded ? 'chevDown' : 'chevRight'} className="w-4 h-4" />
          </button>
        ) : <div className="w-6" />}
        <TypeBadge type={item.type} />
        <span className="flex-1 text-white truncate">{item.name}</span>
        {item.story_points > 0 && <Badge s="xs">{item.story_points} SP</Badge>}
        {team && <Badge s="xs" v="info"><span className="w-2 h-2 rounded-full mr-1 inline-block" style={{ background: team.color }} />{team.name}</Badge>}
        {item.sprint && <Badge s="xs" v="warning">S{item.sprint}</Badge>}
        <div className={`w-2 h-2 rounded-full bg-${statusColors[item.status]}-400`} />
      </div>
      {isExpanded && children.map(child => <HierarchyItem key={child.id} item={child} level={level + 1} />)}
    </div>;
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.backlog.title}</h2>
      <div className="flex items-center gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-slate-900/50">
          <button onClick={() => setViewMode('hierarchy')} className={`px-3 py-1 rounded text-xs ${viewMode === 'hierarchy' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}><Icon name="folder" className="w-4 h-4 inline mr-1" />{t.backlog.hierarchy}</button>
          <button onClick={() => setViewMode('flat')} className={`px-3 py-1 rounded text-xs ${viewMode === 'flat' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}><Icon name="list" className="w-4 h-4 inline mr-1" />{t.backlog.flat}</button>
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-1.5 rounded-lg input-field text-white text-sm">
          <option value="all">{t.backlog.all}</option>
          <option value="unplanned">{t.backlog.unplanned}</option>
        </select>
        <div className="flex gap-1">
          <button onClick={() => setShowAdd('epic')} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><Icon name="plus" className="w-4 h-4" /> Epic</button>
          <button onClick={() => setShowAdd('feature')} className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><Icon name="plus" className="w-4 h-4" /> Feature</button>
          <button onClick={() => setShowAdd('story')} className="btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"><Icon name="plus" className="w-4 h-4" /> Story</button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Badge v="purple">Epic</Badge><span className="text-white font-semibold">{epics.length}</span></div><p className="text-xs text-slate-400">Large initiatives spanning multiple PIs</p></div>
      <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Badge v="info">Feature</Badge><span className="text-white font-semibold">{features.length}</span></div><p className="text-xs text-slate-400">Deliverable within a PI</p></div>
      <div className="glass rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Badge v="success">Story</Badge><span className="text-white font-semibold">{stories.length}</span></div><p className="text-xs text-slate-400">Deliverable within a Sprint</p></div>
    </div>

    <div className="glass rounded-xl p-4">
      {viewMode === 'hierarchy' ? (
        <div className="space-y-1">
          {epics.map(epic => <HierarchyItem key={epic.id} item={epic} />)}
          {features.filter(f => !f.parent_id).map(feat => <HierarchyItem key={feat.id} item={feat} />)}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer" onClick={() => setSelItem(item)}>
              <TypeBadge type={item.type} />
              <span className="flex-1 text-white truncate">{item.name}</span>
              {item.story_points > 0 && <Badge s="xs">{item.story_points} SP</Badge>}
              {item.sprint && <Badge s="xs" v="warning">S{item.sprint}</Badge>}
            </div>
          ))}
        </div>
      )}
      {filteredItems.length === 0 && <p className="text-center text-slate-500 py-8">{t.c.noData}</p>}
    </div>

    <Modal open={!!selItem} onClose={() => setSelItem(null)} title={selItem?.name} size="xl">
      {selItem && <ItemEditForm item={selItem} onSave={(upd) => { updateItem(selItem.id, upd); setSelItem(null); }} onDelete={() => { deleteItem(selItem.id); setSelItem(null); }} onClose={() => setSelItem(null)} />}
    </Modal>

    <Modal open={!!showAdd} onClose={() => setShowAdd(null)} title={`Add ${showAdd}`}>
      {showAdd && <ItemAddForm type={showAdd} onSave={(item) => { addItem(item); setShowAdd(null); }} onClose={() => setShowAdd(null)} />}
    </Modal>
  </div>;
};

// Item Edit Form with all features
const ItemEditForm = ({ item, onSave, onDelete, onClose }) => {
  const { t, teams, allMembers, items, deps, sprints, absences, settings, addItem } = useApp();
  const [form, setForm] = useState({ ...item });
  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const teamMembers = allMembers.filter(m => m.team_id === form.team_id);
  const parentOptions = items.filter(i => {
    if (form.type === 'feature') return i.type === 'epic';
    if (form.type === 'story') return i.type === 'feature';
    return false;
  });
  const children = items.filter(i => i.parent_id === item.id);

  const handleSuggestSprint = () => {
    const result = AutomationEngine.suggestSprint(form, items, teams, deps, sprints, absences);
    setSuggestion({ type: 'sprint', ...result });
  };

  const handleSuggestAssignee = () => {
    const result = AutomationEngine.suggestAssignee(form, items, teams, absences, sprints);
    setSuggestion({ type: 'assignee', ...result });
  };

  const handleGenerateAC = async () => {
    setGenerating(true);
    const ac = await AutomationEngine.generateAcceptanceCriteria(form);
    setForm({ ...form, acceptance_criteria: ac });
    setGenerating(false);
  };

  const handleBreakdownStories = async () => {
    if (form.type !== 'feature') return;
    setGenerating(true);
    const stories = await AutomationEngine.generateStoryBreakdown(form);
    stories.forEach(s => {
      addItem({
        type: 'story',
        name: s.name,
        story_points: s.sp,
        team_id: form.team_id,
        sprint: form.sprint,
        status: 'notStarted',
        business_value: form.business_value,
        parent_id: item.id,
        description: '',
        acceptance_criteria: ''
      });
    });
    setGenerating(false);
    alert(t.auto.storiesGenerated);
  };

  const acceptSuggestion = () => {
    if (suggestion.type === 'sprint') setForm({ ...form, sprint: suggestion.sprint });
    if (suggestion.type === 'assignee') setForm({ ...form, assignee_id: suggestion.assignee });
    setSuggestion(null);
  };

  return <div className="space-y-4">
    <div className="flex items-center gap-2">
      <TypeBadge type={form.type} />
      {item.parent_id && <span className="text-xs text-slate-400">← {items.find(i => i.id === item.parent_id)?.name}</span>}
    </div>

    <Input label={t.board.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
    
    <TextArea label={t.board.desc} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />

    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase text-slate-400">{t.board.ac}</label>
        <button onClick={handleGenerateAC} disabled={generating} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <Icon name="spark" className="w-3 h-3" /> {generating ? t.auto.generating : t.board.generateAC}
        </button>
      </div>
      <textarea value={form.acceptance_criteria || ''} onChange={e => setForm({ ...form, acceptance_criteria: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white resize-none font-mono text-sm" rows={5} placeholder="- Criterion 1\n- Criterion 2" />
    </div>

    {form.type !== 'epic' && (
      <>
        <div className="grid grid-cols-2 gap-4">
          <Select label={t.c.team} value={form.team_id || ''} onChange={e => setForm({ ...form, team_id: e.target.value, assignee_id: null })}>
            <option value="">{t.board.selectTeam}</option>
            {teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
          </Select>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase text-slate-400">{t.board.assignee}</label>
              {settings.autoSuggest && form.team_id && <button onClick={handleSuggestAssignee} className="text-xs text-cyan-400 hover:text-cyan-300">{t.board.suggestAssignee}</button>}
            </div>
            <select value={form.assignee_id || ''} onChange={e => setForm({ ...form, assignee_id: e.target.value || null })} className="w-full px-4 py-2 rounded-lg input-field text-white">
              <option value="">{t.board.selectPerson}</option>
              {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase text-slate-400">{t.c.sprint}</label>
              {settings.autoSuggest && form.team_id && <button onClick={handleSuggestSprint} className="text-xs text-cyan-400 hover:text-cyan-300">{t.board.suggestSprint}</button>}
            </div>
            <select value={form.sprint || ''} onChange={e => setForm({ ...form, sprint: parseInt(e.target.value) || null })} className="w-full px-4 py-2 rounded-lg input-field text-white">
              <option value="">{t.board.unassigned}</option>
              {[1,2,3,4,5].map(s => <option key={s} value={s}>S{s}</option>)}
            </select>
          </div>
          <Select label={t.board.sp} value={form.story_points} onChange={e => setForm({ ...form, story_points: parseInt(e.target.value) })}>
            {[1,2,3,5,8,13,20,40,100].map(sp => <option key={sp} value={sp}>{sp} SP</option>)}
          </Select>
          <Select label={t.board.status} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="notStarted">{t.board.notStarted}</option>
            <option value="inProgress">{t.board.inProgress}</option>
            <option value="done">{t.board.done}</option>
            <option value="blocked">{t.board.blocked}</option>
          </Select>
        </div>
      </>
    )}

    {parentOptions.length > 0 && (
      <Select label={t.board.parent} value={form.parent_id || ''} onChange={e => setForm({ ...form, parent_id: e.target.value || null })}>
        <option value="">— {t.c.none} —</option>
        {parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </Select>
    )}

    <Input label={t.board.bv} type="number" value={form.business_value} onChange={e => setForm({ ...form, business_value: parseInt(e.target.value) })} min="1" max="10" />

    {suggestion && (
      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-300">{suggestion.type === 'sprint' ? t.auto.sprint : t.auto.assignee}: <strong>{suggestion.type === 'sprint' ? `Sprint ${suggestion.sprint}` : suggestion.name}</strong></p>
            <p className="text-xs text-slate-400">{suggestion.reason}</p>
          </div>
          <button onClick={acceptSuggestion} className="btn-primary px-3 py-1 rounded text-xs">{t.auto.accept}</button>
        </div>
      </div>
    )}

    {children.length > 0 && (
      <div className="p-3 rounded-lg bg-slate-800/50">
        <p className="text-xs uppercase text-slate-400 mb-2">{t.board.children} ({children.length})</p>
        <div className="flex flex-wrap gap-2">
          {children.map(c => <Badge key={c.id} s="sm"><TypeBadge type={c.type} /> {c.name.substring(0, 20)}...</Badge>)}
        </div>
      </div>
    )}

    {form.type === 'feature' && children.length === 0 && (
      <button onClick={handleBreakdownStories} disabled={generating} className="w-full py-2 rounded-lg border border-dashed border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm flex items-center justify-center gap-2">
        <Icon name="spark" className="w-4 h-4" /> {generating ? t.auto.generating : t.board.breakdownStories}
      </button>
    )}

    <div className="flex justify-between pt-4 border-t border-slate-700">
      <button onClick={onDelete} className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 text-sm flex items-center gap-2"><Icon name="trash" className="w-4 h-4" />{t.c.delete}</button>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button>
        <button onClick={() => onSave(form)} className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.save}</button>
      </div>
    </div>
  </div>;
};

// Item Add Form
const ItemAddForm = ({ type, onSave, onClose }) => {
  const { t, teams, allMembers, items } = useApp();
  const [form, setForm] = useState({ 
    type, 
    name: '', 
    description: '', 
    acceptance_criteria: '',
    story_points: type === 'epic' ? 0 : 20, 
    team_id: type === 'epic' ? null : teams[0]?.id || '', 
    assignee_id: null, 
    sprint: type === 'epic' ? null : 1, 
    business_value: 5, 
    status: 'notStarted',
    parent_id: null
  });

  const teamMembers = allMembers.filter(m => m.team_id === form.team_id);
  const parentOptions = items.filter(i => {
    if (type === 'feature') return i.type === 'epic';
    if (type === 'story') return i.type === 'feature';
    return false;
  });

  return <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
    <Input label={t.board.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
    <TextArea label={t.board.desc} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
    
    {type !== 'epic' && (
      <div className="grid grid-cols-2 gap-4">
        <Select label={t.c.team} value={form.team_id || ''} onChange={e => setForm({ ...form, team_id: e.target.value, assignee_id: null })}>
          {teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
        </Select>
        <Select label={t.board.assignee} value={form.assignee_id || ''} onChange={e => setForm({ ...form, assignee_id: e.target.value || null })}>
          <option value="">{t.board.selectPerson}</option>
          {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Select>
      </div>
    )}

    {type !== 'epic' && (
      <div className="grid grid-cols-3 gap-4">
        <Select label={t.c.sprint} value={form.sprint || ''} onChange={e => setForm({ ...form, sprint: parseInt(e.target.value) || null })}>
          <option value="">{t.board.unassigned}</option>
          {[1,2,3,4,5].map(s => <option key={s} value={s}>S{s}</option>)}
        </Select>
        <Select label={t.board.sp} value={form.story_points} onChange={e => setForm({ ...form, story_points: parseInt(e.target.value) })}>
          {[1,2,3,5,8,13,20,40,100].map(sp => <option key={sp} value={sp}>{sp} SP</option>)}
        </Select>
        <Input label={t.board.bv} type="number" value={form.business_value} onChange={e => setForm({ ...form, business_value: parseInt(e.target.value) })} min="1" max="10" />
      </div>
    )}

    {parentOptions.length > 0 && (
      <Select label={t.board.parent} value={form.parent_id || ''} onChange={e => setForm({ ...form, parent_id: e.target.value || null })}>
        <option value="">— {t.c.none} —</option>
        {parentOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </Select>
    )}

    <div className="flex justify-end gap-3 pt-4">
      <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button>
      <button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button>
    </div>
  </form>;
};

// Capacity View
const Capacity = () => {
  const { t, teams, sprints, absences, updateAbsence, items } = useApp();
  const [selTeam, setSelTeam] = useState(teams[0]?.id);
  const team = teams.find(tm => tm.id === selTeam);
  const members = team?.team_members || [];
  const features = items.filter(i => i.type !== 'epic');

  const teamCap = useMemo(() => {
    if (!team) return null;
    const spData = sprints.map((sp, i) => { 
      const sn = i + 1; 
      let max = 0, abs = 0; 
      members.forEach(m => { max += sp.netDays * (m.fte || 1); abs += absences[`${selTeam}-${m.id}-${sn}`] || 0; }); 
      const alloc = features.filter(f => f.team_id === selTeam && f.sprint === sn).reduce((sum, f) => sum + (f.story_points || 0) / 4, 0);
      return { sn, max, abs, net: max - abs, alloc, avail: max - abs - alloc, isIP: sp.isIP }; 
    });
    return { spData, totMax: spData.reduce((s, d) => s + d.max, 0), totAbs: spData.reduce((s, d) => s + d.abs, 0), totNet: spData.reduce((s, d) => s + d.net, 0), totAlloc: spData.reduce((s, d) => s + d.alloc, 0) };
  }, [team, sprints, absences, features, selTeam, members]);

  if (!team || !teamCap) return <div className="text-slate-400">{t.c.loading}</div>;
  const util = teamCap.totNet > 0 ? (teamCap.totAlloc / teamCap.totNet) * 100 : 0;

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.cap.title}</h2>
      <div className="flex gap-2">{teams.map(tm => <button key={tm.id} onClick={() => setSelTeam(tm.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${selTeam === tm.id ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'glass text-slate-400 border-transparent'}`}>{tm.name}</button>)}</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat label={t.cap.max} value={teamCap.totMax} />
      <Stat label={t.cap.abs} value={teamCap.totAbs} color="amber" />
      <Stat label={t.cap.net} value={teamCap.totNet} color="emerald" />
      <Stat label={t.dash.allocated} value={teamCap.totAlloc.toFixed(0)} color="purple" />
      <Stat label={t.dash.util} value={`${util.toFixed(0)}%`} color={healthColor(util)} />
    </div>
    {util > 80 && <div className={`p-4 rounded-lg ${util > 100 ? 'bg-red-500/20 border border-red-500/50' : 'bg-amber-500/20 border border-amber-500/50'}`}><p className={util > 100 ? 'text-red-400' : 'text-amber-400'}>⚠️ {util > 100 ? t.cap.danger : t.cap.warn}</p></div>}
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-700"><h3 className="font-semibold text-white">{t.cap.abs}</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-slate-900/40 text-xs uppercase text-slate-400"><th className="px-4 py-3 text-left">Member</th>{[1,2,3,4,5].map(s => <th key={s} className="px-4 py-3 text-center">S{s}</th>)}<th className="px-4 py-3 text-center">{t.c.total}</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {members.map(m => { 
              const tot = [1,2,3,4,5].reduce((sum, sn) => sum + (absences[`${selTeam}-${m.id}-${sn}`] || 0), 0); 
              return <tr key={m.id}>
                <td className="px-4 py-3 text-white">{m.name}</td>
                {[1,2,3,4,5].map(sn => <td key={sn} className="px-4 py-2 text-center"><input type="number" value={absences[`${selTeam}-${m.id}-${sn}`] || 0} onChange={e => updateAbsence(selTeam, m.id, sn, parseInt(e.target.value) || 0)} className="w-14 px-2 py-1.5 rounded input-field text-white text-center font-mono text-sm" min="0" max="10" /></td>)}
                <td className="px-4 py-3 text-center"><Badge v="warning">{tot}</Badge></td>
              </tr>; 
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
};

// Program Board (simplified - uses items)
const ProgramBoard = () => {
  const { t, teams, items, sprints, milestones, deps, allMembers, updateItem } = useApp();
  const [selItem, setSelItem] = useState(null);
  const features = items.filter(i => i.type === 'feature' || i.type === 'story');

  const onDragStart = (e, item) => e.dataTransfer.setData('itemId', item.id);
  const onDrop = (e, tid, sn) => { e.preventDefault(); const itemId = e.dataTransfer.getData('itemId'); updateItem(itemId, { team_id: tid, sprint: sn }); e.currentTarget.classList.remove('bg-cyan-500/10'); };
  const onDragOver = e => { e.preventDefault(); e.currentTarget.classList.add('bg-cyan-500/10'); };
  const onDragLeave = e => e.currentTarget.classList.remove('bg-cyan-500/10');
  
  const getAssigneeName = (item) => { if (!item.assignee_id) return null; const m = allMembers.find(m => m.id === item.assignee_id); return m?.name; };

  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.board.title}</h2>
    <div className="flex gap-4 pb-2">
      {['healthy', 'atRisk', 'violated'].map(h => { 
        const cnt = deps.filter(d => depHealth(d.provider_sprint, d.consumer_sprint) === h).length; 
        return <div key={h} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
          <div className={`w-2 h-2 rounded-full ${h === 'healthy' ? 'bg-emerald-400' : h === 'atRisk' ? 'bg-amber-400' : 'bg-red-400'}`} />
          <span className="text-slate-300">{t.board[h]}</span>
          <Badge v={h === 'healthy' ? 'success' : h === 'atRisk' ? 'warning' : 'danger'}>{cnt}</Badge>
        </div>; 
      })}
    </div>
    <div className="glass rounded-xl overflow-hidden overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="flex border-b border-slate-700">
          <div className="w-36 shrink-0 p-3 bg-slate-900/80 border-r border-slate-700"><span className="text-xs uppercase text-slate-400">{t.board.miles}</span></div>
          {sprints.map((sp, i) => <div key={i} className="flex-1 min-w-[140px] p-3 border-r border-slate-700 bg-slate-900/40"><div className="flex flex-wrap gap-2">{milestones.filter(m => m.sprint === i + 1).map(m => <div key={m.id} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: `${m.color}30`, color: m.color }}>◆ {m.name}</div>)}</div></div>)}
        </div>
        <div className="flex border-b border-slate-700">
          <div className="w-36 shrink-0 p-3 bg-slate-900/80 border-r border-slate-700"><span className="text-xs uppercase text-slate-400">{t.board.teams}</span></div>
          {sprints.map((sp, i) => <div key={i} className="flex-1 min-w-[140px] p-3 text-center border-r border-slate-700 bg-slate-900/40"><span className="font-semibold text-white text-sm">{sp.isIP ? t.c.ip : `S${sp.num}`}</span><p className="text-xs text-slate-400 mt-1">{fd(sp.start).slice(5)}</p></div>)}
        </div>
        {teams.map(tm => (
          <div key={tm.id} className="flex border-b border-slate-700 last:border-b-0">
            <div className="w-36 shrink-0 p-3 bg-slate-900/80 border-r border-slate-700"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: tm.color }} /><span className="font-medium text-white text-sm">{tm.name}</span></div></div>
            {sprints.map((sp, i) => { 
              const spItems = features.filter(f => f.team_id === tm.id && f.sprint === i + 1); 
              return <div key={i} className="flex-1 min-w-[140px] p-2 border-r border-slate-700 min-h-[100px] transition-colors" onDrop={e => onDrop(e, tm.id, i + 1)} onDragOver={onDragOver} onDragLeave={onDragLeave}>
                <div className="space-y-2">
                  {spItems.map(item => { 
                    const fDeps = deps.filter(d => d.consumer_id === item.id || d.provider_id === item.id); 
                    const hasViol = fDeps.some(d => depHealth(d.provider_sprint, d.consumer_sprint) === 'violated'); 
                    const assignee = getAssigneeName(item); 
                    const statusColors = { notStarted: 'slate', inProgress: 'cyan', done: 'emerald', blocked: 'red' }; 
                    const sc = statusColors[item.status] || 'slate'; 
                    return <div key={item.id} draggable onDragStart={e => onDragStart(e, item)} onClick={() => setSelItem(item)} className={`p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] bg-${sc}-500/20 border border-${sc}-500/30`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <TypeBadge type={item.type} />
                          <span className="text-xs font-medium text-white line-clamp-2">{item.name}</span>
                        </div>
                        {fDeps.length > 0 && <span className={`text-xs ${hasViol ? 'text-red-400' : 'text-emerald-400'}`}>⛓</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <Badge s="xs">{item.story_points} SP</Badge>
                        <Badge s="xs" v="purple">BV:{item.business_value}</Badge>
                      </div>
                      {assignee && <div className="mt-1 text-xs text-slate-400 flex items-center gap-1"><Icon name="user" className="w-3 h-3" />{assignee.split(' ')[0]}</div>}
                    </div>; 
                  })}
                </div>
              </div>; 
            })}
          </div>
        ))}
      </div>
    </div>
    <Modal open={!!selItem} onClose={() => setSelItem(null)} title={selItem?.name} size="xl">
      {selItem && <ItemEditForm item={selItem} onSave={(upd) => { updateItem(selItem.id, upd); setSelItem(null); }} onDelete={() => { setSelItem(null); }} onClose={() => setSelItem(null)} />}
    </Modal>
  </div>;
};

// Objectives
const Objectives = () => {
  const { t, objectives, teams, addObjective, updateObjective } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const committed = objectives.filter(o => o.committed);
  const uncommitted = objectives.filter(o => !o.committed);
  const planned = committed.reduce((s, o) => s + (o.planned_value || o.business_value), 0);
  const actual = committed.reduce((s, o) => s + (o.actual_value || 0), 0);
  const predict = planned > 0 ? (actual / planned) * 100 : 0;
  
  const ObjCard = ({ obj }) => { 
    const tm = teams.find(t => t.id === obj.team_id); 
    return <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1"><h4 className="font-medium text-white">{obj.name}</h4><div className="flex items-center gap-2 mt-2">{tm && <Badge s="xs"><span className="w-2 h-2 rounded-full mr-1 inline-block" style={{ background: tm.color }} />{tm.name}</Badge>}<Badge v="purple" s="xs">BV: {obj.business_value}</Badge></div></div>
        <div className="flex flex-col items-end gap-2">
          <select value={obj.status} onChange={e => updateObjective(obj.id, { status: e.target.value })} className="px-2 py-1 rounded input-field text-white text-xs"><option value="notStarted">{t.board.notStarted}</option><option value="inProgress">{t.board.inProgress}</option><option value="done">{t.board.done}</option></select>
          {obj.committed && <input type="number" value={obj.actual_value || ''} onChange={e => updateObjective(obj.id, { actual_value: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 rounded input-field text-white text-xs text-center" min="0" max="10" placeholder={t.obj.actual} />}
        </div>
      </div>
    </div>; 
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-white">{t.obj.title}</h2><button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="plus" /> {t.obj.add}</button></div>
    <div className="glass rounded-xl p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white">{t.obj.predict}</h3><Badge v={predict >= 80 ? 'success' : predict >= 60 ? 'warning' : 'danger'} s="md">{predict.toFixed(0)}%</Badge></div><Bar val={actual} max={planned} h="h-4" /><p className="text-xs text-slate-400 mt-2">{t.obj.target}</p></div>
    <div className="glass rounded-xl overflow-hidden"><div className="px-6 py-4 bg-emerald-500/10 border-b border-slate-700 flex items-center gap-2"><Icon name="check" /><h3 className="font-semibold text-emerald-400">{t.obj.committed}</h3><Badge v="success">{committed.length}</Badge></div><div className="p-4 space-y-3">{committed.map(o => <ObjCard key={o.id} obj={o} />)}{committed.length === 0 && <p className="text-slate-500 text-center py-4">{t.c.noData}</p>}</div></div>
    <div className="glass rounded-xl overflow-hidden"><div className="px-6 py-4 bg-amber-500/10 border-b border-slate-700 flex items-center gap-2"><Icon name="target" /><h3 className="font-semibold text-amber-400">{t.obj.uncommitted}</h3><Badge v="warning">{uncommitted.length}</Badge></div><div className="p-4 space-y-3">{uncommitted.map(o => <ObjCard key={o.id} obj={o} />)}{uncommitted.length === 0 && <p className="text-slate-500 text-center py-4">{t.c.noData}</p>}</div></div>
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.obj.add}><ObjAddForm onSave={(o) => { addObjective(o); setShowAdd(false); }} onClose={() => setShowAdd(false)} /></Modal>
  </div>;
};

const ObjAddForm = ({ onSave, onClose }) => {
  const { t, teams } = useApp();
  const [form, setForm] = useState({ name: '', committed: true, business_value: 5, team_id: teams[0]?.id || '' });
  return <form onSubmit={e => { e.preventDefault(); onSave({ ...form, planned_value: form.business_value, actual_value: null, status: 'notStarted' }); }} className="space-y-4">
    <TextArea label="Objective" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} rows={2} required />
    <div className="grid grid-cols-2 gap-4">
      <Select label={t.c.team} value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })}>{teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}</Select>
      <Input label={t.board.bv} type="number" value={form.business_value} onChange={e => setForm({ ...form, business_value: parseInt(e.target.value) })} min="1" max="10" />
    </div>
    <div className="flex items-center gap-3"><input type="checkbox" checked={form.committed} onChange={e => setForm({ ...form, committed: e.target.checked })} className="w-4 h-4 rounded" /><label className="text-slate-300">{t.obj.committed}</label></div>
    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

// ROAM Board
const RoamBoard = () => {
  const { t, risks, items, allMembers, addRisk, updateRisk } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [dragged, setDragged] = useState(null);
  const cols = ['resolved', 'owned', 'accepted', 'mitigated'];
  const drop = status => { if (dragged) { updateRisk(dragged.id, { status }); setDragged(null); } };
  const features = items.filter(i => i.type === 'feature');
  
  const RiskCard = ({ risk }) => { 
    const owner = allMembers.find(m => m.id === risk.owner_id); 
    const feat = features.find(f => f.id === risk.feature_id); 
    const sevColors = { high: 'bg-red-500/20', medium: 'bg-amber-500/20', low: 'bg-emerald-500/20' }; 
    return <div draggable onDragStart={() => setDragged(risk)} className={`p-3 rounded-lg cursor-grab ${sevColors[risk.severity]} border border-slate-700`}>
      <p className="text-sm text-white mb-2">{risk.name}</p>
      <div className="flex flex-wrap gap-2"><Badge v={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'success'} s="xs">{t.risk[risk.severity]}</Badge>{owner && <Badge s="xs">{owner.name}</Badge>}{feat && <Badge v="purple" s="xs">{feat.name.substring(0, 12)}...</Badge>}</div>
      {risk.due_date && <p className="text-xs text-slate-400 mt-2">📅 {risk.due_date}</p>}
    </div>; 
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-white">{t.risk.title}</h2><button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="plus" /> {t.risk.add}</button></div>
    <div className="grid grid-cols-4 gap-4">
      {cols.map(status => { 
        const colRisks = risks.filter(r => r.status === status); 
        const bg = status === 'resolved' ? 'bg-emerald-500/10' : status === 'owned' ? 'bg-amber-500/10' : status === 'accepted' ? 'bg-blue-500/10' : 'bg-purple-500/10'; 
        return <div key={status} className={`glass rounded-xl overflow-hidden ${bg}`} onDragOver={e => e.preventDefault()} onDrop={() => drop(status)}>
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between"><h3 className="font-semibold text-white">{t.risk[status]}</h3><Badge>{colRisks.length}</Badge></div>
          <div className="p-3 space-y-3 min-h-[200px]">{colRisks.map(r => <RiskCard key={r.id} risk={r} />)}{colRisks.length === 0 && <p className="text-slate-500 text-sm text-center py-8">{t.risk.none}</p>}</div>
        </div>; 
      })}
    </div>
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.risk.add}><RiskAddForm onSave={(r) => { addRisk(r); setShowAdd(false); }} onClose={() => setShowAdd(false)} /></Modal>
  </div>;
};

const RiskAddForm = ({ onSave, onClose }) => {
  const { t, items, allMembers } = useApp();
  const features = items.filter(i => i.type === 'feature');
  const [form, setForm] = useState({ name: '', severity: 'medium', owner_id: '', feature_id: '', due_date: '' });
  return <form onSubmit={e => { e.preventDefault(); onSave({ ...form, status: 'owned' }); }} className="space-y-4">
    <TextArea label="Description" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} rows={2} required />
    <div className="grid grid-cols-2 gap-4">
      <Select label={t.risk.severity} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}><option value="high">{t.risk.high}</option><option value="medium">{t.risk.medium}</option><option value="low">{t.risk.low}</option></Select>
      <Select label={t.risk.owner} value={form.owner_id} onChange={e => setForm({ ...form, owner_id: e.target.value })}><option value="">— {t.c.none} —</option>{allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</Select>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Select label={t.risk.feature} value={form.feature_id} onChange={e => setForm({ ...form, feature_id: e.target.value })}><option value="">— {t.c.none} —</option>{features.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</Select>
      <Input label={t.risk.due} type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
    </div>
    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

// Voting
const Voting = () => {
  const { t, voting, setVoting, user } = useApp();
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [votes, setVotes] = useState({});
  const start = () => { setVoting({ active: true, start: Date.now(), dur: 120 }); setUserVote(null); setVotes({}); };
  const end = () => setVoting(null);
  const vote = v => { setUserVote(v); setVotes(prev => ({ ...prev, [user?.id || 'demo']: v })); };
  useEffect(() => { if (voting?.active && voting.start) { const int = setInterval(() => { const elapsed = Math.floor((Date.now() - voting.start) / 1000); const rem = Math.max(0, (voting.dur || 120) - elapsed); setTimeLeft(rem); if (rem === 0) end(); }, 1000); return () => clearInterval(int); } }, [voting]);
  const voteVals = Object.values(votes);
  const avg = voteVals.length > 0 ? (voteVals.reduce((a, b) => a + b, 0) / voteVals.length).toFixed(1) : 0;
  const dist = [1, 2, 3, 4, 5].map(v => voteVals.filter(vt => vt === v).length);
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-white">{t.vote.title}</h2>{!voting?.active ? <button onClick={start} className="btn-primary px-6 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="vote" /> {t.vote.start}</button> : <div className="flex items-center gap-4"><div className="text-amber-400 font-mono text-lg">⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div><button onClick={end} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.vote.end}</button></div>}</div>
    <div className="glass rounded-xl p-6"><h3 className="text-lg font-semibold text-white mb-4">{t.vote.fof}</h3>{voting?.active && !userVote && <div className="grid grid-cols-5 gap-4">{[1, 2, 3, 4, 5].map(v => <button key={v} onClick={() => vote(v)} className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${v <= 2 ? 'border-red-500/50 hover:bg-red-500/20' : v === 3 ? 'border-amber-500/50 hover:bg-amber-500/20' : 'border-emerald-500/50 hover:bg-emerald-500/20'}`}><div className="text-3xl mb-2">{v === 1 ? '✊' : v === 2 ? '☝️' : v === 3 ? '✌️' : v === 4 ? '🤟' : '🖐️'}</div><div className="text-xl font-bold text-white">{v}</div><p className="text-xs text-slate-400 mt-1">{t.vote.exp[v]}</p></button>)}</div>}{voting?.active && userVote && <div className="text-center py-8"><p className="text-lg text-slate-400">{t.vote.your}</p><div className="text-5xl mt-4">{userVote}</div></div>}{!voting?.active && <div className="text-center py-8"><p className="text-slate-400">{voteVals.length > 0 ? `${t.vote.avg}: ${avg}` : t.vote.noVotes}</p></div>}</div>
    {voteVals.length > 0 && <div className="glass rounded-xl p-6"><h3 className="font-semibold text-white mb-4">{t.vote.dist}</h3><div className="space-y-3">{[5, 4, 3, 2, 1].map(v => <div key={v} className="flex items-center gap-3"><span className="w-8 text-center font-mono">{v}</span><div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${v <= 2 ? 'bg-red-500' : v === 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${voteVals.length > 0 ? (dist[v - 1] / voteVals.length) * 100 : 0}%` }} /></div><span className="w-8 text-center text-slate-400">{dist[v - 1]}</span></div>)}</div></div>}
  </div>;
};

// Settings
const Settings = () => {
  const { t, lang, setLang, teams, settings, setSettings, addTeam, updateTeam, deleteTeam, addMember, updateMember, deleteMember } = useApp();
  const [editTeam, setEditTeam] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', color: '#22d3ee', velocity: 40 });
  const [newMember, setNewMember] = useState({ name: '', fte: 1, role: 'Developer' });
  const handleAddTeam = () => { addTeam(newTeam); setShowAddTeam(false); setNewTeam({ name: '', color: '#22d3ee', velocity: 40 }); };
  const handleAddMember = (teamId) => { addMember({ ...newMember, team_id: teamId }); setShowAddMember(null); setNewMember({ name: '', fte: 1, role: 'Developer' }); };
  
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.set.title}</h2>
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">{t.set.lang}</h3>
      <div className="flex gap-2">
        <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-lg ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'glass text-slate-400'}`}>English</button>
        <button onClick={() => setLang('pl')} className={`px-4 py-2 rounded-lg ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'glass text-slate-400'}`}>Polski</button>
      </div>
    </div>

    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Icon name="spark" />{t.set.autoFeatures}</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.autoStatus} onChange={e => setSettings({ ...settings, autoStatus: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-slate-300">{t.set.autoStatus}</span>
          <span className="text-xs text-slate-500">Epic/Feature status = worst child status</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.autoSP} onChange={e => setSettings({ ...settings, autoSP: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-slate-300">{t.set.autoSP}</span>
          <span className="text-xs text-slate-500">Epic SP = sum of Features SP</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={settings.autoSuggest} onChange={e => setSettings({ ...settings, autoSuggest: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-slate-300">{t.set.autoSuggest}</span>
          <span className="text-xs text-slate-500">Show sprint/assignee suggestions</span>
        </label>
      </div>
    </div>

    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2"><Icon name="users" />{t.set.editTeams}</h3>
        <button onClick={() => setShowAddTeam(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="plus" className="w-4 h-4" />{t.set.addTeam}</button>
      </div>
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <input type="color" value={team.color} onChange={e => updateTeam(team.id, { color: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                {editTeam === team.id ? <input type="text" value={team.name} onChange={e => updateTeam(team.id, { name: e.target.value })} onBlur={() => setEditTeam(null)} autoFocus className="px-3 py-1 rounded input-field text-white text-lg font-medium" /> : <span className="text-lg font-medium text-white cursor-pointer hover:text-cyan-300" onClick={() => setEditTeam(team.id)}>{team.name}</span>}
                <div className="flex items-center gap-2 text-sm text-slate-400"><span>{t.c.velocity}:</span><input type="number" value={team.velocity} onChange={e => updateTeam(team.id, { velocity: parseInt(e.target.value) })} className="w-16 px-2 py-1 rounded input-field text-white text-center" min="10" max="100" /></div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddMember(team.id)} className="p-2 hover:bg-slate-700 rounded-lg text-cyan-400"><Icon name="plus" className="w-4 h-4" /></button>
                <button onClick={() => deleteTeam(team.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"><Icon name="trash" className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-2 ml-11">
              {(team.team_members || []).map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded bg-slate-800/50 group">
                  <div className="flex items-center gap-3">
                    <Icon name="user" className="w-4 h-4 text-slate-500" />
                    {editMember === member.id ? <input type="text" value={member.name} onChange={e => updateMember(member.id, { name: e.target.value })} onBlur={() => setEditMember(null)} autoFocus className="px-2 py-1 rounded input-field text-white text-sm" /> : <span className="text-sm text-white cursor-pointer hover:text-cyan-300" onClick={() => setEditMember(member.id)}>{member.name}</span>}
                    <Badge s="xs">{member.role}</Badge>
                    <span className="text-xs text-slate-500">FTE: {member.fte}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select value={member.role} onChange={e => updateMember(member.id, { role: e.target.value })} className="px-2 py-1 rounded input-field text-white text-xs"><option value="Developer">Developer</option><option value="QA">QA</option><option value="Tech Lead">Tech Lead</option><option value="Scrum Master">Scrum Master</option></select>
                    <input type="number" value={member.fte} onChange={e => updateMember(member.id, { fte: parseFloat(e.target.value) })} className="w-14 px-2 py-1 rounded input-field text-white text-xs text-center" min="0.1" max="1" step="0.1" />
                    <button onClick={() => deleteMember(member.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400"><Icon name="trash" className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            {showAddMember === team.id && (
              <div className="mt-3 ml-11 p-3 rounded bg-slate-800/50 border border-cyan-500/30">
                <div className="flex gap-2">
                  <input type="text" placeholder="Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="flex-1 px-3 py-2 rounded input-field text-white text-sm" />
                  <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} className="px-3 py-2 rounded input-field text-white text-sm"><option value="Developer">Developer</option><option value="QA">QA</option><option value="Tech Lead">Tech Lead</option></select>
                  <button onClick={() => handleAddMember(team.id)} className="btn-primary px-4 py-2 rounded-lg text-sm">{t.c.add}</button>
                  <button onClick={() => setShowAddMember(null)} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Modal open={showAddTeam} onClose={() => setShowAddTeam(false)} title={t.set.addTeam}>
      <div className="space-y-4">
        <Input label={t.set.teamName} value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-xs uppercase text-slate-400 mb-2">Color</label><input type="color" value={newTeam.color} onChange={e => setNewTeam({ ...newTeam, color: e.target.value })} className="w-full h-10 rounded cursor-pointer" /></div>
          <Input label={t.set.velocity} type="number" value={newTeam.velocity} onChange={e => setNewTeam({ ...newTeam, velocity: parseInt(e.target.value) })} min="10" max="100" />
        </div>
        <div className="flex justify-end gap-3 pt-4"><button onClick={() => setShowAddTeam(false)} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button onClick={handleAddTeam} className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
      </div>
    </Modal>
  </div>;
};

// History
const History = () => {
  const { t, history, isDemo } = useApp();
  const actionColors = { INSERT: 'success', UPDATE: 'warning', DELETE: 'danger' };
  const actionLabels = { INSERT: t.hist.insert, UPDATE: t.hist.update, DELETE: t.hist.delete };
  if (isDemo) return <div className="space-y-6"><h2 className="text-2xl font-bold text-white">{t.hist.title}</h2><div className="glass rounded-xl p-8 text-center text-slate-400">History tracking requires Supabase connection</div></div>;
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.hist.title}</h2>
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-slate-900/80 text-xs uppercase text-slate-400"><th className="px-4 py-3 text-left">{t.hist.time}</th><th className="px-4 py-3 text-left">{t.hist.table}</th><th className="px-4 py-3 text-left">{t.hist.action}</th><th className="px-4 py-3 text-left">{t.hist.user}</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {history.map(h => <tr key={h.id} className="hover:bg-slate-800/30"><td className="px-4 py-3 text-sm text-slate-400">{new Date(h.changed_at).toLocaleString()}</td><td className="px-4 py-3"><Badge s="xs">{h.table_name}</Badge></td><td className="px-4 py-3"><Badge v={actionColors[h.action]} s="xs">{actionLabels[h.action]}</Badge></td><td className="px-4 py-3 text-sm text-slate-300">{h.changed_by_email || 'System'}</td></tr>)}
            {history.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">{t.c.noData}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
};

// Main App
export default function App() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('dashboard');
  const [pi, setPi] = useState('PI44');
  const [teams, setTeams] = useState([]);
  const [items, setItems] = useState([]); // Combined epics, features, stories
  const [deps, setDeps] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [risks, setRisks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [absences, setAbsences] = useState({});
  const [history, setHistory] = useState([]);
  const [voting, setVoting] = useState(null);
  const [synced, setSynced] = useState(false);
  const [settings, setSettings] = useState({ autoStatus: true, autoSP: true, autoSuggest: true });
  const t = T[lang];

  useEffect(() => { if (isConfigured()) { auth.getSession().then(({ data }) => { if (data.session) { setUser(data.session.user); setSession(data.session); } setLoading(false); }); const { data: { subscription } } = auth.onAuthStateChange((_, session) => { setUser(session?.user || null); setSession(session); }); return () => subscription?.unsubscribe(); } else { setLoading(false); } }, []);

  const loadData = useCallback(async () => {
    if (isDemo) { setTeams(demoTeams); setItems(demoItems); setDeps(demoDeps); setObjectives(demoObjectives); setRisks(demoRisks); setMilestones(demoMilestones); setSynced(true); return; }
    if (!isConfigured()) return;
    // In real app: load from Supabase
    setSynced(true);
  }, [pi, isDemo]);

  useEffect(() => { if (user || isDemo) loadData(); }, [user, isDemo, loadData]);

  const handleAuth = (u, s) => { setUser(u); setSession(s); };
  const handleDemo = () => { setIsDemo(true); setUser({ email: 'demo@example.com', id: 'demo' }); };
  const handleSignOut = async () => { await auth.signOut(); setUser(null); setSession(null); setIsDemo(false); setTeams([]); setItems([]); };

  const allMembers = useMemo(() => teams.flatMap(tm => tm.team_members || []), [teams]);
  const sprints = useMemo(() => calcSprints(pd(PI_PRESETS[pi].s), 10, 5), [pi]);
  const piSum = useMemo(() => { const s = pd(PI_PRESETS[pi].s), e = pd(PI_PRESETS[pi].e); return { calDays: Math.ceil((e - s) / 86400000) + 1, workDays: getWorkDays(s, e) }; }, [pi]);

  // Auto-propagate status and SP when settings enabled
  useEffect(() => {
    if (!settings.autoStatus && !settings.autoSP) return;
    
    const updates = [];
    items.filter(i => i.type === 'epic' || i.type === 'feature').forEach(parent => {
      const children = items.filter(i => i.parent_id === parent.id);
      if (children.length === 0) return;
      
      if (settings.autoStatus) {
        const newStatus = AutomationEngine.calculateParentStatus(children);
        if (parent.status !== newStatus) updates.push({ id: parent.id, status: newStatus });
      }
      if (settings.autoSP && parent.type === 'epic') {
        const newSP = AutomationEngine.calculateParentSP(items.filter(i => i.parent_id === parent.id));
        if (parent.story_points !== newSP) updates.push({ id: parent.id, story_points: newSP });
      }
    });
    
    if (updates.length > 0) {
      setItems(prev => prev.map(item => {
        const upd = updates.find(u => u.id === item.id);
        return upd ? { ...item, ...upd } : item;
      }));
    }
  }, [items, settings.autoStatus, settings.autoSP]);

  const crud = {
    addTeam: async (team) => { if (isDemo) { setTeams(prev => [...prev, { ...team, id: uid(), team_members: [] }]); return; } },
    updateTeam: async (id, upd) => { if (isDemo) { setTeams(prev => prev.map(t => t.id === id ? { ...t, ...upd } : t)); return; } },
    deleteTeam: async (id) => { if (isDemo) { setTeams(prev => prev.filter(t => t.id !== id)); return; } },
    addMember: async (member) => { if (isDemo) { setTeams(prev => prev.map(t => t.id === member.team_id ? { ...t, team_members: [...(t.team_members || []), { ...member, id: uid() }] } : t)); return; } },
    updateMember: async (id, upd) => { if (isDemo) { setTeams(prev => prev.map(t => ({ ...t, team_members: (t.team_members || []).map(m => m.id === id ? { ...m, ...upd } : m) }))); return; } },
    deleteMember: async (id) => { if (isDemo) { setTeams(prev => prev.map(t => ({ ...t, team_members: (t.team_members || []).filter(m => m.id !== id) }))); return; } },
    addItem: async (item) => { setItems(prev => [...prev, { ...item, id: uid() }]); },
    updateItem: async (id, upd) => { setItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i)); },
    deleteItem: async (id) => { setItems(prev => prev.filter(i => i.id !== id && i.parent_id !== id)); },
    addObjective: async (obj) => { if (isDemo) { setObjectives(prev => [...prev, { ...obj, id: uid() }]); return; } },
    updateObjective: async (id, upd) => { if (isDemo) { setObjectives(prev => prev.map(o => o.id === id ? { ...o, ...upd } : o)); return; } },
    addRisk: async (risk) => { if (isDemo) { setRisks(prev => [...prev, { ...risk, id: uid() }]); return; } },
    updateRisk: async (id, upd) => { if (isDemo) { setRisks(prev => prev.map(r => r.id === id ? { ...r, ...upd } : r)); return; } },
    updateAbsence: async (teamId, memberId, sprint, days) => { setAbsences(prev => ({ ...prev, [`${teamId}-${memberId}-${sprint}`]: days })); },
  };

  const ctx = { t, lang, setLang, teams, items, deps, objectives, risks, milestones, absences, allMembers, sprints, piSum, pi, setPi, user, isDemo, synced, history, voting, setVoting, settings, setSettings, ...crud };

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
    { id: 'settings', label: t.nav.settings, icon: 'settings' }, 
    { id: 'history', label: t.nav.history, icon: 'history' }
  ];
  const views = { dashboard: Dashboard, backlog: Backlog, capacity: Capacity, board: ProgramBoard, objectives: Objectives, risks: RoamBoard, voting: Voting, settings: Settings, history: History };
  const View = views[view] || Dashboard;

  return <AppContext.Provider value={ctx}>
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); .font-mono { font-family: 'JetBrains Mono', monospace; } .glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.1); } .input-field { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); transition: all 0.2s; border-radius: 0.5rem; } .input-field:focus { border-color: rgba(34, 211, 238, 0.5); box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1); outline: none; } .btn-primary { background: linear-gradient(135deg, #22d3ee, #34d399); color: white; font-weight: 600; transition: all 0.2s; } .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3); } .btn-secondary { background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.2); color: #94a3b8; } .btn-secondary:hover { background: rgba(148, 163, 184, 0.2); color: white; } select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.2rem; padding-right: 2rem; }`}</style>
      <header className="glass sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center"><span className="text-xl font-bold text-white">π</span></div><div><h1 className="text-lg font-semibold">{t.app.title}</h1><p className="text-xs text-slate-400">{t.app.subtitle}</p></div></div>
          <div className="flex items-center gap-3">
            {synced && <Badge v="success" s="xs">● {t.c.synced}</Badge>}
            {isDemo && <Badge v="warning" s="xs">DEMO</Badge>}
            <div className="flex gap-1 p-1 rounded-lg bg-slate-900/50"><button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>EN</button><button onClick={() => setLang('pl')} className={`px-2 py-1 rounded text-xs ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>PL</button></div>
            <div className="flex gap-1">{Object.keys(PI_PRESETS).map(p => <button key={p} onClick={() => setPi(p)} className={`px-2 py-1 rounded text-xs ${pi === p ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}>{p}</button>)}</div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700"><span className="text-sm text-slate-400">{user?.email}</span><button onClick={handleSignOut} className="text-xs text-red-400 hover:text-red-300">{t.auth.signOut}</button></div>
          </div>
        </div>
      </header>
      <div className="max-w-[1600px] mx-auto flex">
        <nav className="w-56 shrink-0 p-4 sticky top-16 h-[calc(100vh-64px)]"><div className="space-y-1">{navItems.map(item => <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}><Icon name={item.icon} /><span>{item.label}</span></button>)}</div></nav>
        <main className="flex-1 p-6 min-h-[calc(100vh-64px)]"><View /></main>
      </div>
    </div>
  </AppContext.Provider>;
}
