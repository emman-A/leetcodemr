-- Row Level Security for public tables (Supabase anon key).
-- App uses a single logical user; policies restrict rows to user_id = 'emmanuel'
-- (see src/lib/db.ts). Adjust if you add Supabase Auth or multiple users.

-- progress
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.progress
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- activity_log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.activity_log
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- solved_log
ALTER TABLE public.solved_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.solved_log
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- fc_visited
ALTER TABLE public.fc_visited ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.fc_visited
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- behavioral_visited
ALTER TABLE public.behavioral_visited ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.behavioral_visited
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- gems_visited
ALTER TABLE public.gems_visited ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.gems_visited
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- pattern_fc_visited
ALTER TABLE public.pattern_fc_visited ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.pattern_fc_visited
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- study_plan
ALTER TABLE public.study_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.study_plan
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- daily_target
ALTER TABLE public.daily_target ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.daily_target
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- practice_sessions
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.practice_sessions
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- time_tracking
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.time_tracking
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- mock_sessions
ALTER TABLE public.mock_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.mock_sessions
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- interview_date
ALTER TABLE public.interview_date ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.interview_date
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.user_settings
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');

-- fc_daily_log
ALTER TABLE public.fc_daily_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_user_emmanuel" ON public.fc_daily_log
  FOR ALL TO anon, authenticated
  USING (user_id = 'emmanuel')
  WITH CHECK (user_id = 'emmanuel');
