-- DevMark Production RLS Policies
-- Execute in Supabase SQL Editor

-- ==========================================
-- 1. USER PROFILES
-- ==========================================

-- Allow users to update their own profile (including Elite status sync)
DROP POLICY IF EXISTS "Users can update own profile" ON public."User";
CREATE POLICY "Users can update own profile" 
ON public."User" FOR UPDATE 
USING (auth.uid() = id);

-- ==========================================
-- 2. PROJECTS
-- ==========================================

-- Creators can manage their own files
DROP POLICY IF EXISTS "Creators can update own projects" ON public."Project";
CREATE POLICY "Creators can update own projects" 
ON public."Project" FOR UPDATE 
USING (auth.uid() = "creatorId");

-- ==========================================
-- 3. PURCHASES
-- ==========================================

-- Buyers can see their successful purchases
DROP POLICY IF EXISTS "Buyers can view own purchases" ON public."Purchase";
CREATE POLICY "Buyers can view own purchases" 
ON public."Purchase" FOR SELECT 
USING (auth.uid() = "buyerId");

-- ==========================================
-- 4. STORAGE (SECURE ASSETS)
-- ==========================================

-- Only buyers of a project can download its source files
-- Note: This requires the buyerId to be checked against the Purchase table
CREATE POLICY "Buyers can download source files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'devmark-assets' 
  AND (storage.foldername(name))[1] = 'sources'
  AND EXISTS (
    SELECT 1 FROM public."Purchase"
    WHERE "buyerId" = auth.uid() 
    AND "status" = 'SUCCESS'
    AND "projectId"::text = (storage.foldername(name))[2]
  )
);
