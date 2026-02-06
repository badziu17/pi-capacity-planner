import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL || '';
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = URL && KEY ? createClient(URL, KEY) : null;
export const isConfigured = () => !!supabase;

export const auth = {
  signUp: async (email, password, fullName) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  },
  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } };
    return supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => supabase ? supabase.auth.signOut() : { error: null },
  getSession: async () => supabase ? supabase.auth.getSession() : { data: { session: null } },
  onAuthStateChange: (cb) => supabase ? supabase.auth.onAuthStateChange(cb) : { data: { subscription: { unsubscribe: () => {} } } }
};

export const db = {
  teams: {
    getAll: () => supabase?.from('teams').select('*, team_members(*)').order('created_at'),
    create: (t) => supabase?.from('teams').insert(t).select().single(),
    update: (id, u) => supabase?.from('teams').update(u).eq('id', id).select().single(),
    delete: (id) => supabase?.from('teams').delete().eq('id', id)
  },
  members: {
    create: (m) => supabase?.from('team_members').insert(m).select().single(),
    update: (id, u) => supabase?.from('team_members').update(u).eq('id', id).select().single(),
    delete: (id) => supabase?.from('team_members').delete().eq('id', id)
  },
  features: {
    getAll: (pi) => supabase?.from('features').select('*').eq('pi_name', pi).order('created_at'),
    create: (f) => supabase?.from('features').insert(f).select().single(),
    update: (id, u) => supabase?.from('features').update(u).eq('id', id).select().single(),
    delete: (id) => supabase?.from('features').delete().eq('id', id)
  },
  deps: {
    getAll: () => supabase?.from('dependencies').select('*').order('created_at'),
    create: (d) => supabase?.from('dependencies').insert(d).select().single(),
    delete: (id) => supabase?.from('dependencies').delete().eq('id', id)
  },
  objectives: {
    getAll: (pi) => supabase?.from('objectives').select('*').eq('pi_name', pi).order('created_at'),
    create: (o) => supabase?.from('objectives').insert(o).select().single(),
    update: (id, u) => supabase?.from('objectives').update(u).eq('id', id).select().single()
  },
  risks: {
    getAll: (pi) => supabase?.from('risks').select('*').eq('pi_name', pi).order('created_at'),
    create: (r) => supabase?.from('risks').insert(r).select().single(),
    update: (id, u) => supabase?.from('risks').update(u).eq('id', id).select().single()
  },
  absences: {
    getAll: (pi) => supabase?.from('absences').select('*').eq('pi_name', pi),
    upsert: (a) => supabase?.from('absences').upsert(a, { onConflict: 'team_id,member_id,sprint,pi_name' }).select().single()
  },
  milestones: {
    getAll: (pi) => supabase?.from('milestones').select('*').eq('pi_name', pi).order('sprint')
  },
  history: {
    getRecent: (limit = 100) => supabase?.from('change_history').select('*').order('changed_at', { ascending: false }).limit(limit)
  }
};

export const realtime = {
  subscribe: (table, cb) => supabase?.channel(`${table}_ch`).on('postgres_changes', { event: '*', schema: 'public', table }, cb).subscribe(),
  unsubscribe: (ch) => supabase?.removeChannel(ch)
};
