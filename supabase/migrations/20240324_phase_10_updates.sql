-- SQL COMMANDS FOR PHASE 10: ADVANCED VENDOR FEATURES
-- Run these in your Supabase SQL Editor

-- 1. Add gallery column to Project table
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "gallery" JSONB DEFAULT '[]'::jsonb;

-- 2. Add projectId and context to Message table
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "projectId" UUID REFERENCES "Project"(id) ON DELETE SET NULL;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "isQuoteRequest" BOOLEAN DEFAULT false;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "subject" TEXT;

-- 3. Update RLS policies for Message if necessary
-- (Assuming public access or authenticated access is already set up)
