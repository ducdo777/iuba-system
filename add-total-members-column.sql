-- Migration: Add totalMembers column to teams table
-- This script adds a totalMembers column to store the number of active members in each team

-- For PostgreSQL
ALTER TABLE "teams" 
ADD COLUMN IF NOT EXISTS "totalMembers" INTEGER DEFAULT 0;

-- Update existing teams with current member counts
UPDATE "teams" t
SET "totalMembers" = (
  SELECT COUNT(*) 
  FROM "users" u 
  WHERE u."teamId" = t.id 
  AND u."status" = 'active'
);

-- For SQLite (if using SQLite)
-- ALTER TABLE teams ADD COLUMN totalMembers INTEGER DEFAULT 0;
-- UPDATE teams SET totalMembers = (
--   SELECT COUNT(*) 
--   FROM users 
--   WHERE users.teamId = teams.id 
--   AND users.status = 'active'
-- );


