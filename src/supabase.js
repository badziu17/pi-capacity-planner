import { createClient } from '@supabase/supabase-js'

// ═══ SUPABASE CONFIG ═══
// Set these in your .env.local file or Vercel environment variables:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY)

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: true, persistSession: true },
      realtime: { params: { eventsPerSecond: 10 } }
    })
  : null

// ═══ AUTH HELPERS ═══
export async function signInWithGoogle() {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
}

export async function signInWithEmail(email) {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  })
}

export async function signOut() {
  if (!supabase) return
  return supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ═══ ICS CALENDAR EXPORT ═══
export function generateICS(trip, days) {
  const esc = s => (s || '').replace(/[,;\\]/g, c => '\\' + c).replace(/\n/g, '\\n')
  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Ventura//Trip Planner//EN\nCALSCALE:GREGORIAN\n'
  
  days.forEach(day => {
    day.items.forEach(item => {
      const dt = day.date ? day.date.replace(/-/g, '') : '20250101'
      const time = (item.time || '10:00').replace(':', '') + '00'
      ics += 'BEGIN:VEVENT\n'
      ics += `DTSTART:${dt}T${time}\n`
      ics += `SUMMARY:${esc(item.name)}\n`
      ics += `DESCRIPTION:${esc(item.desc || '')} — ${trip.dest || ''}\n`
      ics += `LOCATION:${esc(trip.dest || '')}\n`
      ics += `UID:${item.id || Date.now()}-${Math.random().toString(36).slice(2)}@ventura\n`
      ics += 'END:VEVENT\n'
    })
  })
  ics += 'END:VCALENDAR'
  
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(trip.name || 'trip').replace(/\s+/g, '-').toLowerCase()}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

// ═══ SHARE LINK ═══
export function getShareUrl(trip) {
  const base = window.location.origin
  return `${base}/?trip=${trip.shareToken || trip.id}`
}

export function copyShareLink(trip) {
  const url = getShareUrl(trip)
  navigator.clipboard?.writeText(url)
  return url
}
