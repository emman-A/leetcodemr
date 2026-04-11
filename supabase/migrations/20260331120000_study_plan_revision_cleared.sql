-- Questions cleared on a revision day (7th study day) do not reappear on later revision days
ALTER TABLE study_plan
  ADD COLUMN IF NOT EXISTS revision_cleared_ids INTEGER[] DEFAULT '{}';
