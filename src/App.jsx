import React, { useState, useMemo, createContext, useContext, useEffect, useReducer } from 'react';

// ==================== CONTEXT ====================
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ==================== TRANSLATIONS ====================
const T = {
  en: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Enterprise Planning Suite' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', objectives: 'PI Objectives', risks: 'ROAM Board', voting: 'Confidence Vote', settings: 'Settings' },
    dash: { title: 'PI Dashboard', calDays: 'Calendar Days', workDays: 'Working Days', teamCap: 'Team Capacity', allocated: 'Allocated', available: 'Available', util: 'Utilization', features: 'Features', risks: 'Open Risks', deps: 'Dependencies' },
    cap: { title: 'Capacity Planning', max: 'Max Capacity', net: 'Net Capacity', abs: 'Absences', sprint: 'Sprint Breakdown', indiv: 'Individual Capacity', warn: 'Warning: Over 80%', danger: 'Over capacity!' },
    board: { title: 'Program Board', addFeat: 'Add Feature', addDep: 'Add Dependency', name: 'Feature Name', sp: 'Story Points', bv: 'Business Value', status: 'Status', notStarted: 'Not Started', inProgress: 'In Progress', done: 'Done', blocked: 'Blocked', deps: 'Dependencies', healthy: 'Healthy', atRisk: 'At Risk', violated: 'Violated', miles: 'Milestones', teams: 'Teams', provider: 'Provider', consumer: 'Consumer', noDeps: 'No dependencies' },
    obj: { title: 'PI Objectives', committed: 'Committed', uncommitted: 'Uncommitted (Stretch)', add: 'Add Objective', name: 'Objective', bv: 'Business Value (1-10)', predict: 'Predictability Measure', target: 'Target: 80-100%', actual: 'Actual Value' },
    risk: { title: 'ROAM Board', resolved: 'Resolved', owned: 'Owned', accepted: 'Accepted', mitigated: 'Mitigated', add: 'Add Risk', name: 'Risk Description', owner: 'Owner', severity: 'Severity', high: 'High', medium: 'Medium', low: 'Low', due: 'Due Date', feature: 'Linked Feature', mitig: 'Mitigation', none: 'No risks' },
    vote: { title: 'Confidence Vote', fof: 'Fist of Five', start: 'Start Voting', end: 'End Voting', inProgress: 'Voting in progress...', your: 'Your Vote', results: 'Results', avg: 'Average', dist: 'Distribution', concerns: 'Concerns', addConcern: 'Add concern...', noVotes: 'No votes yet', exp: { 5: 'Full confidence', 4: 'Minor concerns', 3: 'Neutral', 2: 'Reservations', 1: 'Cannot commit' } },
    set: { title: 'Settings', lang: 'Language', theme: 'Theme', dark: 'Dark', light: 'Light', capDef: 'Capacity Defaults', buffer: 'Default Buffer (%)', hours: 'Hours/Day' },
    c: { save: 'Save', cancel: 'Cancel', delete: 'Delete', add: 'Add', close: 'Close', total: 'Total', md: 'MD', sp: 'SP', fte: 'FTE', sprint: 'Sprint', team: 'Team', none: 'None', noData: 'No data', loading: 'Loading...', members: 'members', velocity: 'Velocity', ip: 'IP Sprint' },
  },
  pl: {
    app: { title: 'PI Capacity Planner', subtitle: 'SAFe 6.0 • Narzędzie Planowania' },
    nav: { dashboard: 'Dashboard', capacity: 'Capacity', board: 'Program Board', objectives: 'Cele PI', risks: 'ROAM Board', voting: 'Głosowanie', settings: 'Ustawienia' },
    dash: { title: 'Dashboard PI', calDays: 'Dni kalendarzowe', workDays: 'Dni robocze', teamCap: 'Capacity zespołu', allocated: 'Przydzielone', available: 'Dostępne', util: 'Wykorzystanie', features: 'Features', risks: 'Otwarte ryzyka', deps: 'Zależności' },
    cap: { title: 'Planowanie Capacity', max: 'Max Capacity', net: 'Capacity netto', abs: 'Nieobecności', sprint: 'Rozbicie na sprinty', indiv: 'Capacity indywidualne', warn: 'Uwaga: Ponad 80%', danger: 'Przekroczenie!' },
    board: { title: 'Program Board', addFeat: 'Dodaj Feature', addDep: 'Dodaj zależność', name: 'Nazwa Feature', sp: 'Story Points', bv: 'Wartość biznesowa', status: 'Status', notStarted: 'Nie rozpoczęte', inProgress: 'W trakcie', done: 'Zakończone', blocked: 'Zablokowane', deps: 'Zależności', healthy: 'Zdrowa', atRisk: 'Zagrożona', violated: 'Naruszona', miles: 'Kamienie milowe', teams: 'Zespoły', provider: 'Dostawca', consumer: 'Odbiorca', noDeps: 'Brak zależności' },
    obj: { title: 'Cele PI', committed: 'Zobowiązane', uncommitted: 'Niezobowiązane (Stretch)', add: 'Dodaj cel', name: 'Cel', bv: 'Wartość biznesowa (1-10)', predict: 'Miara przewidywalności', target: 'Cel: 80-100%', actual: 'Rzeczywista wartość' },
    risk: { title: 'ROAM Board', resolved: 'Rozwiązane', owned: 'Z właścicielem', accepted: 'Zaakceptowane', mitigated: 'Zmitigowane', add: 'Dodaj ryzyko', name: 'Opis ryzyka', owner: 'Właściciel', severity: 'Ważność', high: 'Wysoka', medium: 'Średnia', low: 'Niska', due: 'Termin', feature: 'Powiązany Feature', mitig: 'Plan mitygacji', none: 'Brak ryzyk' },
    vote: { title: 'Głosowanie', fof: 'Fist of Five', start: 'Rozpocznij', end: 'Zakończ', inProgress: 'Głosowanie w toku...', your: 'Twój głos', results: 'Wyniki', avg: 'Średnia', dist: 'Rozkład', concerns: 'Obawy', addConcern: 'Dodaj obawę...', noVotes: 'Brak głosów', exp: { 5: 'Pełne zaufanie', 4: 'Drobne obawy', 3: 'Neutralny', 2: 'Zastrzeżenia', 1: 'Nie mogę' } },
    set: { title: 'Ustawienia', lang: 'Język', theme: 'Motyw', dark: 'Ciemny', light: 'Jasny', capDef: 'Domyślne capacity', buffer: 'Domyślny bufor (%)', hours: 'Godzin/dzień' },
    c: { save: 'Zapisz', cancel: 'Anuluj', delete: 'Usuń', add: 'Dodaj', close: 'Zamknij', total: 'Suma', md: 'MD', sp: 'SP', fte: 'FTE', sprint: 'Sprint', team: 'Zespół', none: 'Brak', noData: 'Brak danych', loading: 'Ładowanie...', members: 'członków', velocity: 'Velocity', ip: 'IP Sprint' },
  },
};

// ==================== DATA ====================
const HOLIDAYS = ['2025-01-01','2025-01-06','2025-04-20','2025-04-21','2025-05-01','2025-05-03','2025-06-08','2025-06-19','2025-08-15','2025-11-01','2025-11-11','2025-12-25','2025-12-26'];
const PI_PRESETS = { PI43: { s: '2025-01-08', e: '2025-02-18' }, PI44: { s: '2025-02-19', e: '2025-04-29' }, PI45: { s: '2025-04-30', e: '2025-07-08' }, PI46: { s: '2025-07-09', e: '2025-09-16' }, PI47: { s: '2025-09-17', e: '2025-11-25' }, PI48: { s: '2025-11-26', e: '2026-02-03' } };
const STATUS_COLORS = { notStarted: 'slate', inProgress: 'blue', done: 'emerald', blocked: 'red' };

// ==================== UTILITIES ====================
const id = () => Math.random().toString(36).substr(2, 9);
const pd = (s) => new Date(s + 'T00:00:00');
const fd = (d) => d.toISOString().split('T')[0];
const isWknd = (d) => d.getDay() === 0 || d.getDay() === 6;
const isHol = (d) => HOLIDAYS.includes(fd(d));
const getWorkDays = (s, e) => { let c = 0, h = 0, cur = new Date(s); while (cur <= e) { if (!isWknd(cur)) { if (isHol(cur)) h++; else c++; } cur.setDate(cur.getDate() + 1); } return { work: c, hol: h }; };
const addWorkDays = (s, days) => { const r = new Date(s); let a = 0; while (a < days) { r.setDate(r.getDate() + 1); if (!isWknd(r) && !isHol(r)) a++; } return r; };
const calcSprints = (piStart, len, cnt) => { const sprints = []; let cur = new Date(piStart); for (let i = 0; i < cnt; i++) { const end = addWorkDays(cur, len - 1); const { work } = getWorkDays(cur, end); sprints.push({ num: i + 1, start: new Date(cur), end, netDays: work, isIP: i === cnt - 1 }); cur = new Date(end); cur.setDate(cur.getDate() + 1); while (isWknd(cur)) cur.setDate(cur.getDate() + 1); } return sprints; };
const healthColor = (p) => p <= 80 ? 'emerald' : p <= 100 ? 'amber' : 'red';
const depHealth = (pS, cS) => pS < cS ? 'healthy' : pS === cS ? 'atRisk' : 'violated';

// ==================== INITIAL STATE ====================
const initState = () => ({
  pi: 'PI44', piStart: PI_PRESETS.PI44.s, piEnd: PI_PRESETS.PI44.e, sprintCnt: 5, sprintLen: 10,
  teams: [
    { id: 'team1', name: 'Team Alpha', color: '#22d3ee', vel: 40, members: [{ id: 't1m1', name: 'Anna Kowalska', fte: 1, role: 'Dev' }, { id: 't1m2', name: 'Jan Nowak', fte: 1, role: 'Dev' }, { id: 't1m3', name: 'Maria Wiśniewska', fte: 1, role: 'Dev' }, { id: 't1m4', name: 'Piotr Zieliński', fte: 1, role: 'QA' }] },
    { id: 'team2', name: 'Team Beta', color: '#34d399', vel: 35, members: [{ id: 't2m1', name: 'Katarzyna Lewandowska', fte: 1, role: 'Dev' }, { id: 't2m2', name: 'Tomasz Wójcik', fte: 1, role: 'Dev' }, { id: 't2m3', name: 'Agnieszka Kamińska', fte: 1, role: 'Dev' }, { id: 't2m4', name: 'Michał Szymański', fte: 1, role: 'QA' }] },
  ],
  absences: {},
  features: [
    { id: 'f1', name: 'User Authentication System', sp: 40, teamId: 'team1', sprint: 1, status: 'inProgress', bv: 8 },
    { id: 'f2', name: 'Dashboard Analytics', sp: 20, teamId: 'team1', sprint: 2, status: 'notStarted', bv: 7 },
    { id: 'f3', name: 'API Integration Layer', sp: 40, teamId: 'team2', sprint: 1, status: 'inProgress', bv: 9 },
    { id: 'f4', name: 'Reporting Module', sp: 20, teamId: 'team2', sprint: 3, status: 'notStarted', bv: 6 },
  ],
  stories: [
    { id: 's1', name: 'Login page UI', md: 3, teamId: 'team1', assignee: 't1m1', featId: 'f1', sprint: 1, status: 'done' },
    { id: 's2', name: 'OAuth integration', md: 5, teamId: 'team1', assignee: 't1m2', featId: 'f1', sprint: 1, status: 'inProgress' },
    { id: 's3', name: 'Session management', md: 4, teamId: 'team1', assignee: 't1m3', featId: 'f1', sprint: 2, status: 'notStarted' },
  ],
  deps: [{ id: 'd1', provId: 'f3', consId: 'f1', provTeam: 'team2', consTeam: 'team1', provSprint: 1, consSprint: 2, desc: 'API endpoints needed' }],
  milestones: [{ id: 'm1', name: 'MVP Release', sprint: 3, color: '#f59e0b' }, { id: 'm2', name: 'Beta Launch', sprint: 5, color: '#8b5cf6' }],
  objectives: [
    { id: 'o1', name: 'Deliver core authentication flow', committed: true, bv: 9, planned: 9, actual: null, status: 'inProgress', teamId: 'team1' },
    { id: 'o2', name: 'Complete API integration framework', committed: true, bv: 8, planned: 8, actual: null, status: 'inProgress', teamId: 'team2' },
    { id: 'o3', name: 'Advanced analytics dashboard', committed: false, bv: 5, planned: 5, actual: null, status: 'notStarted', teamId: 'team1' },
  ],
  risks: [
    { id: 'r1', name: 'Third-party API rate limits may impact performance', status: 'owned', severity: 'medium', owner: 't2m1', due: '2025-03-15', featId: 'f3', mitig: 'Implement caching' },
    { id: 'r2', name: 'Key developer vacation during Sprint 3', status: 'accepted', severity: 'low', owner: 't1m1', due: null, featId: null, mitig: 'Cross-training done' },
  ],
  voting: { active: false, start: null, dur: 120, votes: {}, concerns: [], history: [] },
  settings: { buffer: 20, hours: 8 },
});

// ==================== REDUCER ====================
const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_PI': return { ...state, pi: payload, piStart: PI_PRESETS[payload]?.s || state.piStart, piEnd: PI_PRESETS[payload]?.e || state.piEnd };
    case 'UPD_ABS': return { ...state, absences: { ...state.absences, [payload.tid]: { ...state.absences[payload.tid], [payload.mid]: { ...state.absences[payload.tid]?.[payload.mid], [payload.sn]: payload.v } } } };
    case 'ADD_FEAT': return { ...state, features: [...state.features, payload] };
    case 'UPD_FEAT': return { ...state, features: state.features.map(f => f.id === payload.id ? { ...f, ...payload.upd } : f) };
    case 'DEL_FEAT': return { ...state, features: state.features.filter(f => f.id !== payload) };
    case 'ADD_DEP': return { ...state, deps: [...state.deps, payload] };
    case 'ADD_OBJ': return { ...state, objectives: [...state.objectives, payload] };
    case 'UPD_OBJ': return { ...state, objectives: state.objectives.map(o => o.id === payload.id ? { ...o, ...payload.upd } : o) };
    case 'ADD_RISK': return { ...state, risks: [...state.risks, payload] };
    case 'UPD_RISK': return { ...state, risks: state.risks.map(r => r.id === payload.id ? { ...r, ...payload.upd } : r) };
    case 'START_VOTE': return { ...state, voting: { ...state.voting, active: true, start: payload.start, dur: payload.dur, votes: {}, concerns: [] } };
    case 'END_VOTE': return { ...state, voting: { ...state.voting, active: false, history: [...state.voting.history, { votes: state.voting.votes, concerns: state.voting.concerns, ts: Date.now() }] } };
    case 'VOTE': return { ...state, voting: { ...state.voting, votes: { ...state.voting.votes, [payload.uid]: payload.v } } };
    case 'CONCERN': return { ...state, voting: { ...state.voting, concerns: [...state.voting.concerns, payload] } };
    case 'UPD_SET': return { ...state, settings: { ...state.settings, ...payload } };
    default: return state;
  }
};

// ==================== COMPONENTS ====================
const Badge = ({ children, v = 'default', s = 'sm' }) => {
  const vars = { default: 'bg-slate-700 text-slate-300', success: 'bg-emerald-500/20 text-emerald-400', warning: 'bg-amber-500/20 text-amber-400', danger: 'bg-red-500/20 text-red-400', info: 'bg-cyan-500/20 text-cyan-400', purple: 'bg-purple-500/20 text-purple-400' };
  const sizes = { xs: 'px-1.5 py-0.5 text-xs', sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center rounded-full font-medium ${vars[v]} ${sizes[s]}`}>{children}</span>;
};

const Icon = ({ name }) => {
  const paths = {
    dash: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    cap: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    board: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
    target: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    risk: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    vote: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    plus: 'M12 4v16m8-8H4',
    x: 'M6 18L18 6M6 6l12 12',
    check: 'M5 13l4 4L19 7',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  };
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name]} /></svg>;
};

const Stat = ({ label, value, sub, color = 'cyan' }) => {
  const colors = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400', purple: 'text-purple-400' };
  return <div className={`glass rounded-xl p-4 ${colors[color]}`}><p className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</p><p className="text-2xl font-bold font-mono">{value}</p>{sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}</div>;
};

const Bar = ({ val, max, h = 'h-2' }) => {
  const pct = Math.min((val / max) * 100, 100);
  const over = val > max;
  return <div className="w-full"><div className={`w-full bg-slate-800 rounded-full overflow-hidden ${h}`}><div className={`${h} ${over ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'} rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} /></div><div className="flex justify-between mt-1 text-xs"><span className={over ? 'text-red-400' : 'text-slate-400'}>{val} / {max}</span><span className={over ? 'text-red-400 font-semibold' : 'text-slate-500'}>{pct.toFixed(0)}%</span></div></div>;
};

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} /><div className={`relative glass rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden`}><div className="flex items-center justify-between p-4 border-b border-slate-700"><h3 className="text-lg font-semibold text-white">{title}</h3><button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg"><Icon name="x" /></button></div><div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">{children}</div></div></div>;
};

// ==================== VIEWS ====================
const Dashboard = () => {
  const { state, t } = useApp();
  const { teams, features, stories, deps, risks, sprints } = state;
  const totalCap = useMemo(() => teams.reduce((s, tm) => s + tm.members.reduce((ms, m) => ms + sprints.reduce((ss, sp) => ss + sp.netDays, 0) * m.fte, 0), 0), [teams, sprints]);
  const allocMD = stories.reduce((s, st) => s + st.md, 0);
  const util = totalCap > 0 ? (allocMD / totalCap) * 100 : 0;
  const openRisks = risks.filter(r => r.status !== 'resolved').length;
  
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.dash.title} — {state.pi}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <Stat label={t.dash.calDays} value={state.piSum?.calDays || 70} />
      <Stat label={t.dash.workDays} value={state.piSum?.workDays || 50} color="emerald" />
      <Stat label={t.dash.teamCap} value={`${totalCap} ${t.c.md}`} color="emerald" />
      <Stat label={t.dash.allocated} value={`${allocMD} ${t.c.md}`} color="amber" />
      <Stat label={t.dash.util} value={`${util.toFixed(0)}%`} color={healthColor(util)} />
      <Stat label={t.dash.features} value={features.length} color="purple" />
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <Stat label={t.dash.deps} value={deps.length} color="amber" />
      <Stat label={t.dash.risks} value={openRisks} color={openRisks > 3 ? 'red' : 'emerald'} />
    </div>
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.c.team}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {teams.map(tm => {
          const tmStories = stories.filter(s => s.teamId === tm.id);
          const tmMD = tmStories.reduce((s, st) => s + st.md, 0);
          const tmCap = tm.members.reduce((s, m) => s + sprints.reduce((ss, sp) => ss + sp.netDays, 0) * m.fte, 0);
          const tmUtil = tmCap > 0 ? (tmMD / tmCap) * 100 : 0;
          return <div key={tm.id} className="p-4 rounded-lg bg-slate-900/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: tm.color }} /><span className="font-medium text-white">{tm.name}</span></div>
              <Badge v={tmUtil > 100 ? 'danger' : tmUtil > 80 ? 'warning' : 'success'}>{tmUtil.toFixed(0)}%</Badge>
            </div>
            <Bar val={tmMD} max={tmCap} />
            <div className="flex justify-between mt-2 text-xs text-slate-400"><span>{tm.members.length} {t.c.members}</span><span>{t.c.velocity}: {tm.vel} SP</span></div>
          </div>;
        })}
      </div>
    </div>
  </div>;
};

const Capacity = () => {
  const { state, dispatch, t } = useApp();
  const { teams, sprints, absences, stories } = state;
  const [selTeam, setSelTeam] = useState(teams[0]?.id);
  const team = teams.find(tm => tm.id === selTeam);
  
  const teamCap = useMemo(() => {
    if (!team) return null;
    const spData = sprints.map((sp, i) => {
      const sn = i + 1;
      let max = 0, abs = 0;
      team.members.forEach(m => { max += sp.netDays * m.fte; abs += absences[selTeam]?.[m.id]?.[sn] || 0; });
      const alloc = stories.filter(s => s.teamId === selTeam && s.sprint === sn).reduce((sum, s) => sum + s.md, 0);
      return { sn, max, abs, net: max - abs, alloc, avail: max - abs - alloc, isIP: sp.isIP };
    });
    return { spData, totMax: spData.reduce((s, d) => s + d.max, 0), totAbs: spData.reduce((s, d) => s + d.abs, 0), totNet: spData.reduce((s, d) => s + d.net, 0), totAlloc: spData.reduce((s, d) => s + d.alloc, 0) };
  }, [team, sprints, absences, stories, selTeam]);
  
  const updAbs = (mid, sn, v) => dispatch({ type: 'UPD_ABS', payload: { tid: selTeam, mid, sn, v: parseInt(v) || 0 } });
  
  if (!team || !teamCap) return <div className="text-slate-400">{t.c.loading}</div>;
  const util = teamCap.totNet > 0 ? (teamCap.totAlloc / teamCap.totNet) * 100 : 0;
  
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.cap.title}</h2>
      <div className="flex gap-2">{teams.map(tm => <button key={tm.id} onClick={() => setSelTeam(tm.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${selTeam === tm.id ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'glass text-slate-400 border-transparent hover:text-white'}`}>{tm.name}</button>)}</div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Stat label={t.cap.max} value={teamCap.totMax} />
      <Stat label={t.cap.abs} value={teamCap.totAbs} color="amber" />
      <Stat label={t.cap.net} value={teamCap.totNet} color="emerald" />
      <Stat label={t.dash.allocated} value={teamCap.totAlloc} color="purple" />
      <Stat label={t.dash.util} value={`${util.toFixed(0)}%`} color={healthColor(util)} />
    </div>
    {util > 80 && <div className={`p-4 rounded-lg ${util > 100 ? 'bg-red-500/20 border border-red-500/50' : 'bg-amber-500/20 border border-amber-500/50'}`}><p className={util > 100 ? 'text-red-400' : 'text-amber-400'}>⚠️ {util > 100 ? t.cap.danger : t.cap.warn}</p></div>}
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-700"><h3 className="font-semibold text-white">{t.cap.sprint}</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3 text-left">{t.c.sprint}</th>
            {teamCap.spData.map(d => <th key={d.sn} className="px-4 py-3 text-center">{d.isIP ? t.c.ip : `S${d.sn}`}</th>)}
            <th className="px-4 py-3 text-center">{t.c.total}</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-800">
            <tr><td className="px-4 py-3 text-slate-300">{t.cap.max}</td>{teamCap.spData.map(d => <td key={d.sn} className="px-4 py-3 text-center font-mono">{d.max}</td>)}<td className="px-4 py-3 text-center font-mono font-semibold">{teamCap.totMax}</td></tr>
            <tr><td className="px-4 py-3 text-slate-300">{t.cap.abs}</td>{teamCap.spData.map(d => <td key={d.sn} className="px-4 py-3 text-center font-mono text-amber-400">-{d.abs}</td>)}<td className="px-4 py-3 text-center font-mono font-semibold text-amber-400">-{teamCap.totAbs}</td></tr>
            <tr className="bg-emerald-500/10"><td className="px-4 py-3 font-semibold text-white">{t.cap.net}</td>{teamCap.spData.map(d => <td key={d.sn} className="px-4 py-3 text-center"><Badge v="success">{d.net}</Badge></td>)}<td className="px-4 py-3 text-center"><Badge v="success" s="md">{teamCap.totNet}</Badge></td></tr>
            <tr><td className="px-4 py-3 text-slate-300">{t.dash.allocated}</td>{teamCap.spData.map(d => <td key={d.sn} className="px-4 py-3 text-center font-mono text-purple-400">{d.alloc}</td>)}<td className="px-4 py-3 text-center font-mono font-semibold text-purple-400">{teamCap.totAlloc}</td></tr>
            <tr className={teamCap.totNet - teamCap.totAlloc < 0 ? 'bg-red-500/10' : 'bg-cyan-500/10'}><td className="px-4 py-3 font-semibold text-white">{t.dash.available}</td>{teamCap.spData.map(d => <td key={d.sn} className="px-4 py-3 text-center"><Badge v={d.avail < 0 ? 'danger' : 'info'}>{d.avail}</Badge></td>)}<td className="px-4 py-3 text-center"><Badge v={teamCap.totNet - teamCap.totAlloc < 0 ? 'danger' : 'info'} s="md">{teamCap.totNet - teamCap.totAlloc}</Badge></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-700"><h3 className="font-semibold text-white">{t.cap.abs}</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr className="bg-slate-900/40 text-xs uppercase text-slate-400"><th className="px-4 py-3 text-left">Member</th>{[1,2,3,4,5].map(s => <th key={s} className="px-4 py-3 text-center">S{s}</th>)}<th className="px-4 py-3 text-center">{t.c.total}</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {team.members.map(m => {
              const tot = Object.values(absences[selTeam]?.[m.id] || {}).reduce((a, b) => a + b, 0);
              return <tr key={m.id}><td className="px-4 py-3 text-white">{m.name}</td>
                {[1,2,3,4,5].map(sn => <td key={sn} className="px-4 py-2 text-center"><input type="number" value={absences[selTeam]?.[m.id]?.[sn] || 0} onChange={e => updAbs(m.id, sn, e.target.value)} className="w-14 px-2 py-1.5 rounded input-field text-white text-center font-mono text-sm" min="0" max="10" /></td>)}
                <td className="px-4 py-3 text-center"><Badge v="warning">{tot}</Badge></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
};

const ProgramBoard = () => {
  const { state, dispatch, t } = useApp();
  const { teams, features, sprints, milestones, deps } = state;
  const [selFeat, setSelFeat] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  
  const onDragStart = (e, f) => e.dataTransfer.setData('fid', f.id);
  const onDrop = (e, tid, sn) => { e.preventDefault(); const fid = e.dataTransfer.getData('fid'); dispatch({ type: 'UPD_FEAT', payload: { id: fid, upd: { teamId: tid, sprint: sn } } }); };
  const onDragOver = e => { e.preventDefault(); e.currentTarget.classList.add('bg-cyan-500/10'); };
  const onDragLeave = e => e.currentTarget.classList.remove('bg-cyan-500/10');
  
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.board.title}</h2>
      <button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="plus" /> {t.board.addFeat}</button>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {['healthy', 'atRisk', 'violated'].map(h => {
        const cnt = deps.filter(d => depHealth(d.provSprint, d.consSprint) === h).length;
        return <div key={h} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"><div className={`w-2 h-2 rounded-full ${h === 'healthy' ? 'bg-emerald-400' : h === 'atRisk' ? 'bg-amber-400' : 'bg-red-400'}`} /><span className="text-slate-300">{t.board[h]}</span><Badge v={h === 'healthy' ? 'success' : h === 'atRisk' ? 'warning' : 'danger'}>{cnt}</Badge></div>;
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
              const spFeats = features.filter(f => f.teamId === tm.id && f.sprint === i + 1);
              return <div key={i} className="flex-1 min-w-[140px] p-2 border-r border-slate-700 min-h-[80px] transition-colors" onDrop={e => onDrop(e, tm.id, i + 1)} onDragOver={onDragOver} onDragLeave={onDragLeave}>
                <div className="space-y-2">
                  {spFeats.map(f => {
                    const fDeps = deps.filter(d => d.consId === f.id || d.provId === f.id);
                    const hasViol = fDeps.some(d => depHealth(d.provSprint, d.consSprint) === 'violated');
                    const sc = STATUS_COLORS[f.status];
                    return <div key={f.id} draggable onDragStart={e => onDragStart(e, f)} onClick={() => setSelFeat(f)} className={`p-2 rounded-lg cursor-pointer transition-all hover:scale-[1.02] bg-${sc}-500/20 border border-${sc}-500/30`}>
                      <div className="flex items-start justify-between gap-1"><span className="text-xs font-medium text-white line-clamp-2">{f.name}</span>{fDeps.length > 0 && <span className={`text-xs ${hasViol ? 'text-red-400' : 'text-emerald-400'}`}>⛓</span>}</div>
                      <div className="flex items-center gap-1 mt-1"><Badge s="xs">{f.sp} SP</Badge><Badge s="xs" v="purple">BV:{f.bv}</Badge></div>
                    </div>;
                  })}
                </div>
              </div>;
            })}
          </div>
        ))}
      </div>
    </div>
    <Modal open={!!selFeat} onClose={() => setSelFeat(null)} title={t.board.name} size="lg">
      {selFeat && <div className="space-y-4">
        <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.name}</label><input type="text" value={selFeat.name} onChange={e => { dispatch({ type: 'UPD_FEAT', payload: { id: selFeat.id, upd: { name: e.target.value } } }); setSelFeat({ ...selFeat, name: e.target.value }); }} className="w-full px-4 py-2 rounded-lg input-field text-white" /></div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.sp}</label><select value={selFeat.sp} onChange={e => dispatch({ type: 'UPD_FEAT', payload: { id: selFeat.id, upd: { sp: parseInt(e.target.value) } } })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value={20}>20 SP</option><option value={40}>40 SP</option><option value={100}>100 SP</option></select></div>
          <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.bv}</label><input type="number" value={selFeat.bv} onChange={e => dispatch({ type: 'UPD_FEAT', payload: { id: selFeat.id, upd: { bv: parseInt(e.target.value) } } })} className="w-full px-4 py-2 rounded-lg input-field text-white" min="1" max="10" /></div>
          <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.status}</label><select value={selFeat.status} onChange={e => dispatch({ type: 'UPD_FEAT', payload: { id: selFeat.id, upd: { status: e.target.value } } })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value="notStarted">{t.board.notStarted}</option><option value="inProgress">{t.board.inProgress}</option><option value="done">{t.board.done}</option><option value="blocked">{t.board.blocked}</option></select></div>
        </div>
        <div className="flex justify-between pt-4 border-t border-slate-700"><button onClick={() => { dispatch({ type: 'DEL_FEAT', payload: selFeat.id }); setSelFeat(null); }} className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 text-sm">{t.c.delete}</button><button onClick={() => setSelFeat(null)} className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.close}</button></div>
      </div>}
    </Modal>
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.board.addFeat}><AddFeatForm onClose={() => setShowAdd(false)} /></Modal>
  </div>;
};

const AddFeatForm = ({ onClose }) => {
  const { state, dispatch, t } = useApp();
  const [form, setForm] = useState({ name: '', sp: 20, teamId: state.teams[0]?.id, sprint: 1, bv: 5, status: 'notStarted' });
  const submit = e => { e.preventDefault(); dispatch({ type: 'ADD_FEAT', payload: { ...form, id: id() } }); onClose(); };
  return <form onSubmit={submit} className="space-y-4">
    <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.name}</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white" required /></div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.c.team}</label><select value={form.teamId} onChange={e => setForm({ ...form, teamId: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white">{state.teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}</select></div>
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.c.sprint}</label><select value={form.sprint} onChange={e => setForm({ ...form, sprint: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg input-field text-white">{[1,2,3,4,5].map(s => <option key={s} value={s}>{t.c.sprint} {s}</option>)}</select></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.sp}</label><select value={form.sp} onChange={e => setForm({ ...form, sp: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value={20}>20 SP</option><option value={40}>40 SP</option><option value={100}>100 SP</option></select></div>
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.board.bv}</label><input type="number" value={form.bv} onChange={e => setForm({ ...form, bv: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg input-field text-white" min="1" max="10" /></div>
    </div>
    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

const Objectives = () => {
  const { state, dispatch, t } = useApp();
  const { objectives, teams } = state;
  const [showAdd, setShowAdd] = useState(false);
  const committed = objectives.filter(o => o.committed);
  const uncommitted = objectives.filter(o => !o.committed);
  const planned = committed.reduce((s, o) => s + o.planned, 0);
  const actual = committed.reduce((s, o) => s + (o.actual || 0), 0);
  const predict = planned > 0 ? (actual / planned) * 100 : 0;
  
  const ObjCard = ({ obj }) => {
    const tm = teams.find(t => t.id === obj.teamId);
    return <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1"><h4 className="font-medium text-white">{obj.name}</h4><div className="flex items-center gap-2 mt-2">{tm && <Badge s="xs"><span className="w-2 h-2 rounded-full mr-1 inline-block" style={{ background: tm.color }} />{tm.name}</Badge>}<Badge v="purple" s="xs">BV: {obj.bv}</Badge></div></div>
        <div className="flex flex-col items-end gap-2">
          <select value={obj.status} onChange={e => dispatch({ type: 'UPD_OBJ', payload: { id: obj.id, upd: { status: e.target.value } } })} className="px-2 py-1 rounded input-field text-white text-xs"><option value="notStarted">{t.board.notStarted}</option><option value="inProgress">{t.board.inProgress}</option><option value="done">{t.board.done}</option></select>
          {obj.committed && <div className="flex items-center gap-2"><span className="text-xs text-slate-400">{t.obj.actual}:</span><input type="number" value={obj.actual || ''} onChange={e => dispatch({ type: 'UPD_OBJ', payload: { id: obj.id, upd: { actual: parseInt(e.target.value) || 0 } } })} className="w-16 px-2 py-1 rounded input-field text-white text-xs text-center" min="0" max="10" placeholder="0" /></div>}
        </div>
      </div>
    </div>;
  };
  
  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-white">{t.obj.title}</h2><button onClick={() => setShowAdd(true)} className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="plus" /> {t.obj.add}</button></div>
    <div className="glass rounded-xl p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white">{t.obj.predict}</h3><Badge v={predict >= 80 ? 'success' : predict >= 60 ? 'warning' : 'danger'} s="md">{predict.toFixed(0)}%</Badge></div><Bar val={actual} max={planned} h="h-4" /><p className="text-xs text-slate-400 mt-2">{t.obj.target}</p></div>
    <div className="glass rounded-xl overflow-hidden"><div className="px-6 py-4 bg-emerald-500/10 border-b border-slate-700 flex items-center gap-2"><Icon name="check" /><h3 className="font-semibold text-emerald-400">{t.obj.committed}</h3><Badge v="success">{committed.length}</Badge></div><div className="p-4 space-y-3">{committed.map(o => <ObjCard key={o.id} obj={o} />)}{committed.length === 0 && <p className="text-slate-500 text-center py-4">{t.c.noData}</p>}</div></div>
    <div className="glass rounded-xl overflow-hidden"><div className="px-6 py-4 bg-amber-500/10 border-b border-slate-700 flex items-center gap-2"><Icon name="target" /><h3 className="font-semibold text-amber-400">{t.obj.uncommitted}</h3><Badge v="warning">{uncommitted.length}</Badge></div><div className="p-4 space-y-3">{uncommitted.map(o => <ObjCard key={o.id} obj={o} />)}{uncommitted.length === 0 && <p className="text-slate-500 text-center py-4">{t.c.noData}</p>}</div></div>
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.obj.add}><AddObjForm onClose={() => setShowAdd(false)} /></Modal>
  </div>;
};

const AddObjForm = ({ onClose }) => {
  const { state, dispatch, t } = useApp();
  const [form, setForm] = useState({ name: '', committed: true, bv: 5, teamId: state.teams[0]?.id });
  const submit = e => { e.preventDefault(); dispatch({ type: 'ADD_OBJ', payload: { id: id(), ...form, planned: form.bv, actual: null, status: 'notStarted' } }); onClose(); };
  return <form onSubmit={submit} className="space-y-4">
    <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.obj.name}</label><textarea value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white resize-none" rows={2} required /></div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.c.team}</label><select value={form.teamId} onChange={e => setForm({ ...form, teamId: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white">{state.teams.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}</select></div>
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.obj.bv}</label><input type="number" value={form.bv} onChange={e => setForm({ ...form, bv: parseInt(e.target.value) })} className="w-full px-4 py-2 rounded-lg input-field text-white" min="1" max="10" /></div>
    </div>
    <div className="flex items-center gap-3"><input type="checkbox" checked={form.committed} onChange={e => setForm({ ...form, committed: e.target.checked })} className="w-4 h-4 rounded" /><label className="text-slate-300">{t.obj.committed}</label></div>
    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

const RoamBoard = () => {
  const { state, dispatch, t } = useApp();
  const { risks, features } = state;
  const [showAdd, setShowAdd] = useState(false);
  const [dragged, setDragged] = useState(null);
  const cols = ['resolved', 'owned', 'accepted', 'mitigated'];
  
  const drop = status => { if (dragged) { dispatch({ type: 'UPD_RISK', payload: { id: dragged.id, upd: { status } } }); setDragged(null); } };
  
  const RiskCard = ({ risk }) => {
    const owner = state.teams.flatMap(t => t.members).find(m => m.id === risk.owner);
    const feat = features.find(f => f.id === risk.featId);
    const sevColors = { high: 'bg-red-500/20', medium: 'bg-amber-500/20', low: 'bg-emerald-500/20' };
    return <div draggable onDragStart={() => setDragged(risk)} className={`p-3 rounded-lg cursor-grab ${sevColors[risk.severity]} border border-slate-700`}>
      <p className="text-sm text-white mb-2">{risk.name}</p>
      <div className="flex flex-wrap gap-2"><Badge v={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'success'} s="xs">{t.risk[risk.severity]}</Badge>{owner && <Badge s="xs">{owner.name}</Badge>}{feat && <Badge v="purple" s="xs">{feat.name.substring(0, 12)}...</Badge>}</div>
      {risk.due && <p className="text-xs text-slate-400 mt-2">📅 {risk.due}</p>}
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
          <div className="p-3 space-y-3 min-h-[250px]">{colRisks.map(r => <RiskCard key={r.id} risk={r} />)}{colRisks.length === 0 && <p className="text-slate-500 text-sm text-center py-8">{t.risk.none}</p>}</div>
        </div>;
      })}
    </div>
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title={t.risk.add}><AddRiskForm onClose={() => setShowAdd(false)} /></Modal>
  </div>;
};

const AddRiskForm = ({ onClose }) => {
  const { state, dispatch, t } = useApp();
  const [form, setForm] = useState({ name: '', severity: 'medium', owner: '', featId: '', mitig: '', due: '' });
  const allMembers = state.teams.flatMap(tm => tm.members);
  const submit = e => { e.preventDefault(); dispatch({ type: 'ADD_RISK', payload: { id: id(), ...form, status: 'owned' } }); onClose(); };
  return <form onSubmit={submit} className="space-y-4">
    <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.name}</label><textarea value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white resize-none" rows={2} required /></div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.severity}</label><select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value="high">{t.risk.high}</option><option value="medium">{t.risk.medium}</option><option value="low">{t.risk.low}</option></select></div>
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.owner}</label><select value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value="">— {t.c.none} —</option>{allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.feature}</label><select value={form.featId} onChange={e => setForm({ ...form, featId: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value="">— {t.c.none} —</option>{state.features.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
      <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.due}</label><input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white" /></div>
    </div>
    <div><label className="block text-xs uppercase text-slate-400 mb-2">{t.risk.mitig}</label><textarea value={form.mitig} onChange={e => setForm({ ...form, mitig: e.target.value })} className="w-full px-4 py-2 rounded-lg input-field text-white resize-none" rows={2} /></div>
    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.c.cancel}</button><button type="submit" className="btn-primary px-6 py-2 rounded-lg text-sm">{t.c.add}</button></div>
  </form>;
};

const Voting = () => {
  const { state, dispatch, t } = useApp();
  const { voting } = state;
  const [userVote, setUserVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [concern, setConcern] = useState('');
  
  useEffect(() => {
    if (voting.active && voting.start) {
      const int = setInterval(() => {
        const elapsed = Math.floor((Date.now() - voting.start) / 1000);
        const rem = Math.max(0, voting.dur - elapsed);
        setTimeLeft(rem);
        if (rem === 0) dispatch({ type: 'END_VOTE' });
      }, 1000);
      return () => clearInterval(int);
    }
  }, [voting.active, voting.start, voting.dur, dispatch]);
  
  const start = () => { dispatch({ type: 'START_VOTE', payload: { start: Date.now(), dur: 120 } }); setUserVote(null); };
  const vote = v => { setUserVote(v); dispatch({ type: 'VOTE', payload: { uid: 'currentUser', v } }); };
  const addConcern = () => { if (concern.trim()) { dispatch({ type: 'CONCERN', payload: { text: concern, voter: 'currentUser', vote: userVote } }); setConcern(''); } };
  
  const votes = Object.values(voting.votes);
  const avg = votes.length > 0 ? (votes.reduce((a, b) => a + b, 0) / votes.length).toFixed(1) : 0;
  const dist = [1, 2, 3, 4, 5].map(v => votes.filter(vt => vt === v).length);
  
  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">{t.vote.title}</h2>
      {!voting.active ? <button onClick={start} className="btn-primary px-6 py-2 rounded-lg text-sm flex items-center gap-2"><Icon name="vote" /> {t.vote.start}</button> : <div className="flex items-center gap-4"><div className="text-amber-400 font-mono text-lg">⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div><button onClick={() => dispatch({ type: 'END_VOTE' })} className="btn-secondary px-4 py-2 rounded-lg text-sm">{t.vote.end}</button></div>}
    </div>
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.vote.fof}</h3>
      {voting.active && !userVote && <div className="grid grid-cols-5 gap-4">{[1, 2, 3, 4, 5].map(v => <button key={v} onClick={() => vote(v)} className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${v <= 2 ? 'border-red-500/50 hover:bg-red-500/20' : v === 3 ? 'border-amber-500/50 hover:bg-amber-500/20' : 'border-emerald-500/50 hover:bg-emerald-500/20'}`}><div className="text-3xl mb-2">{v === 1 ? '✊' : v === 2 ? '☝️' : v === 3 ? '✌️' : v === 4 ? '🤟' : '🖐️'}</div><div className="text-xl font-bold text-white">{v}</div><p className="text-xs text-slate-400 mt-1">{t.vote.exp[v]}</p></button>)}</div>}
      {voting.active && userVote && <div className="text-center py-8"><p className="text-lg text-slate-400">{t.vote.your}</p><div className="text-5xl mt-4">{userVote}</div></div>}
      {!voting.active && <div className="text-center py-8"><p className="text-slate-400">{votes.length > 0 ? `${t.vote.results}: ${avg}` : t.vote.noVotes}</p></div>}
    </div>
    {userVote && userVote <= 2 && <div className="glass rounded-xl p-6"><h4 className="font-semibold text-white mb-3">{t.vote.addConcern}</h4><div className="flex gap-3"><input type="text" value={concern} onChange={e => setConcern(e.target.value)} className="flex-1 px-4 py-2 rounded-lg input-field text-white" placeholder={t.vote.addConcern} /><button onClick={addConcern} className="btn-primary px-4 py-2 rounded-lg">{t.c.add}</button></div></div>}
    {votes.length > 0 && <div className="grid md:grid-cols-2 gap-6">
      <div className="glass rounded-xl p-6"><h3 className="font-semibold text-white mb-4">{t.vote.dist}</h3><div className="space-y-3">{[5, 4, 3, 2, 1].map(v => <div key={v} className="flex items-center gap-3"><span className="w-8 text-center font-mono">{v}</span><div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${v <= 2 ? 'bg-red-500' : v === 3 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${votes.length > 0 ? (dist[v - 1] / votes.length) * 100 : 0}%` }} /></div><span className="w-8 text-center text-slate-400">{dist[v - 1]}</span></div>)}</div></div>
      <div className="glass rounded-xl p-6"><div className="text-center mb-6"><p className="text-sm text-slate-400 uppercase">{t.vote.avg}</p><p className="text-5xl font-bold text-white mt-2">{avg}</p><p className="text-sm text-slate-400 mt-1">{votes.length} votes</p></div>{voting.concerns.length > 0 && <div><h4 className="font-semibold text-white mb-3">{t.vote.concerns}</h4><div className="space-y-2 max-h-40 overflow-y-auto">{voting.concerns.map((c, i) => <div key={i} className="p-2 rounded bg-red-500/10 text-sm"><span className="text-red-400">⚠️ </span><span className="text-slate-300">{c.text}</span></div>)}</div></div>}</div>
    </div>}
  </div>;
};

const Settings = () => {
  const { state, dispatch, t, lang, setLang } = useApp();
  return <div className="space-y-6">
    <h2 className="text-2xl font-bold text-white">{t.set.title}</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass rounded-xl p-6"><h3 className="font-semibold text-white mb-4">{t.set.lang}</h3><select value={lang} onChange={e => setLang(e.target.value)} className="w-full px-4 py-2 rounded-lg input-field text-white"><option value="en">English</option><option value="pl">Polski</option></select></div>
      <div className="glass rounded-xl p-6"><h3 className="font-semibold text-white mb-4">{t.set.capDef}</h3><div className="space-y-4"><div><label className="block text-xs uppercase text-slate-400 mb-2">{t.set.buffer}</label><input type="number" value={state.settings.buffer} onChange={e => dispatch({ type: 'UPD_SET', payload: { buffer: parseInt(e.target.value) } })} className="w-full px-4 py-2 rounded-lg input-field text-white" min="0" max="50" /></div><div><label className="block text-xs uppercase text-slate-400 mb-2">{t.set.hours}</label><input type="number" value={state.settings.hours} onChange={e => dispatch({ type: 'UPD_SET', payload: { hours: parseInt(e.target.value) } })} className="w-full px-4 py-2 rounded-lg input-field text-white" min="4" max="12" /></div></div></div>
    </div>
  </div>;
};

// ==================== MAIN APP ====================
export default function App() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('dashboard');
  const [state, dispatch] = useReducer(reducer, initState());
  const t = T[lang];
  
  const sprints = useMemo(() => calcSprints(pd(state.piStart), state.sprintLen, state.sprintCnt), [state.piStart, state.sprintLen, state.sprintCnt]);
  const piSum = useMemo(() => { const s = pd(state.piStart), e = pd(state.piEnd); const { work, hol } = getWorkDays(s, e); return { calDays: Math.ceil((e - s) / 86400000) + 1, hol, workDays: work }; }, [state.piStart, state.piEnd]);
  const ctx = { state: { ...state, sprints, piSum }, dispatch, t, lang, setLang };
  
  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: 'dash' },
    { id: 'capacity', label: t.nav.capacity, icon: 'cap' },
    { id: 'board', label: t.nav.board, icon: 'board' },
    { id: 'objectives', label: t.nav.objectives, icon: 'target' },
    { id: 'risks', label: t.nav.risks, icon: 'risk' },
    { id: 'voting', label: t.nav.voting, icon: 'vote' },
    { id: 'settings', label: t.nav.settings, icon: 'settings' },
  ];
  
  const views = { dashboard: Dashboard, capacity: Capacity, board: ProgramBoard, objectives: Objectives, risks: RoamBoard, voting: Voting, settings: Settings };
  const View = views[view] || Dashboard;
  
  return <AppContext.Provider value={ctx}>
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(148, 163, 184, 0.1); }
        .input-field { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(148, 163, 184, 0.2); transition: all 0.2s; border-radius: 0.5rem; }
        .input-field:focus { border-color: rgba(34, 211, 238, 0.5); box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1); outline: none; }
        .btn-primary { background: linear-gradient(135deg, #22d3ee, #34d399); color: white; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3); }
        .btn-secondary { background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.2); color: #94a3b8; transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(148, 163, 184, 0.2); color: white; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 1.2rem; padding-right: 2rem; }
      `}</style>
      <header className="glass sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center"><span className="text-xl font-bold text-white">π</span></div><div><h1 className="text-lg font-semibold">{t.app.title}</h1><p className="text-xs text-slate-400">{t.app.subtitle}</p></div></div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/50">
                <button onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs font-medium ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>EN</button>
                <button onClick={() => setLang('pl')} className={`px-2 py-1 rounded text-xs font-medium ${lang === 'pl' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>PL</button>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">{Object.keys(PI_PRESETS).map(pi => <button key={pi} onClick={() => dispatch({ type: 'SET_PI', payload: pi })} className={`px-2 py-1 rounded text-xs font-medium ${state.pi === pi ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'}`}>{pi}</button>)}</div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-[1600px] mx-auto flex">
        <nav className="w-56 shrink-0 p-4 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-1">{navItems.map(item => <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === item.id ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}><Icon name={item.icon} /><span>{item.label}</span></button>)}</div>
        </nav>
        <main className="flex-1 p-6 min-h-[calc(100vh-64px)]"><View /></main>
      </div>
      <footer className="glass border-t border-slate-800"><div className="max-w-[1600px] mx-auto px-4 py-3 flex justify-between items-center text-xs text-slate-500"><span>SAFe 6.0 Capacity Planner • 5 x 2-week sprints</span><span>{state.pi} • {state.piStart} → {state.piEnd}</span></div></footer>
    </div>
  </AppContext.Provider>;
}
