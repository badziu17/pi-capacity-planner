-- =====================================================
-- PI CAPACITY PLANNER - SUPABASE SCHEMA
-- Run this in: Supabase Dashboard → SQL Editor
-- =====================================================

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#22d3ee',
  velocity INTEGER DEFAULT 40,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fte DECIMAL(3,2) DEFAULT 1.0,
  role TEXT DEFAULT 'Developer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Features
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  story_points INTEGER DEFAULT 20,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  assignee_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  sprint INTEGER DEFAULT 1,
  status TEXT DEFAULT 'notStarted',
  business_value INTEGER DEFAULT 5,
  pi_name TEXT DEFAULT 'PI44',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dependencies
CREATE TABLE IF NOT EXISTS dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES features(id) ON DELETE CASCADE,
  consumer_id UUID REFERENCES features(id) ON DELETE CASCADE,
  provider_sprint INTEGER,
  consumer_sprint INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  committed BOOLEAN DEFAULT true,
  business_value INTEGER DEFAULT 5,
  planned_value INTEGER,
  actual_value INTEGER,
  status TEXT DEFAULT 'notStarted',
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  pi_name TEXT DEFAULT 'PI44',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'owned',
  severity TEXT DEFAULT 'medium',
  owner_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  due_date DATE,
  feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
  mitigation TEXT,
  pi_name TEXT DEFAULT 'PI44',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Absences
CREATE TABLE IF NOT EXISTS absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  sprint INTEGER NOT NULL,
  days INTEGER DEFAULT 0,
  pi_name TEXT DEFAULT 'PI44',
  UNIQUE(team_id, member_id, sprint, pi_name)
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sprint INTEGER NOT NULL,
  color TEXT DEFAULT '#f59e0b',
  pi_name TEXT DEFAULT 'PI44',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Change history
CREATE TABLE IF NOT EXISTS change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_by_email TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_history ENABLE ROW LEVEL SECURITY;

-- Allow all for authenticated users
CREATE POLICY "auth_all" ON teams FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON team_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON features FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON dependencies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON objectives FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON risks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON absences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON milestones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all" ON change_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_teams_updated BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_members_updated BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_features_updated BEFORE UPDATE ON features FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_objectives_updated BEFORE UPDATE ON objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_risks_updated BEFORE UPDATE ON risks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Change history trigger
CREATE OR REPLACE FUNCTION log_change() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO change_history (table_name, record_id, action, new_data, changed_by, changed_by_email)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO change_history (table_name, record_id, action, old_data, new_data, changed_by, changed_by_email)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO change_history (table_name, record_id, action, old_data, changed_by, changed_by_email)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid()));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_features AFTER INSERT OR UPDATE OR DELETE ON features FOR EACH ROW EXECUTE FUNCTION log_change();
CREATE TRIGGER log_objectives AFTER INSERT OR UPDATE OR DELETE ON objectives FOR EACH ROW EXECUTE FUNCTION log_change();
CREATE TRIGGER log_risks AFTER INSERT OR UPDATE OR DELETE ON risks FOR EACH ROW EXECUTE FUNCTION log_change();
CREATE TRIGGER log_teams AFTER INSERT OR UPDATE OR DELETE ON teams FOR EACH ROW EXECUTE FUNCTION log_change();

-- =====================================================
-- REALTIME
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
ALTER PUBLICATION supabase_realtime ADD TABLE features;
ALTER PUBLICATION supabase_realtime ADD TABLE objectives;
ALTER PUBLICATION supabase_realtime ADD TABLE risks;
ALTER PUBLICATION supabase_realtime ADD TABLE absences;

-- =====================================================
-- INITIAL DATA
-- =====================================================

INSERT INTO teams (id, name, color, velocity) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Team Alpha', '#22d3ee', 40),
  ('22222222-2222-2222-2222-222222222222', 'Team Beta', '#34d399', 35)
ON CONFLICT DO NOTHING;

INSERT INTO team_members (team_id, name, fte, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Anna Kowalska', 1.0, 'Developer'),
  ('11111111-1111-1111-1111-111111111111', 'Jan Nowak', 1.0, 'Developer'),
  ('11111111-1111-1111-1111-111111111111', 'Maria Wiśniewska', 1.0, 'Developer'),
  ('11111111-1111-1111-1111-111111111111', 'Piotr Zieliński', 1.0, 'QA'),
  ('22222222-2222-2222-2222-222222222222', 'Katarzyna Lewandowska', 1.0, 'Developer'),
  ('22222222-2222-2222-2222-222222222222', 'Tomasz Wójcik', 1.0, 'Developer'),
  ('22222222-2222-2222-2222-222222222222', 'Agnieszka Kamińska', 1.0, 'Developer'),
  ('22222222-2222-2222-2222-222222222222', 'Michał Szymański', 1.0, 'QA');

INSERT INTO milestones (name, sprint, color, pi_name) VALUES
  ('MVP Release', 3, '#f59e0b', 'PI44'),
  ('Beta Launch', 5, '#8b5cf6', 'PI44');
