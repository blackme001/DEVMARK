-- MASTER SECUIRTY FIX: RLS Policies for DevMark
-- Run this in your Supabase SQL Editor to fix Upload and Purchase errors.

-- ==========================================
-- 1. PROJECT POLICIES
-- ==========================================

-- Allow anyone to view approved projects
DROP POLICY IF EXISTS "Approved projects are viewable by everyone" ON public."Project";
CREATE POLICY "Approved projects are viewable by everyone" 
ON public."Project" FOR SELECT 
USING (status = 'APPROVED' OR auth.uid() = "creatorId");

-- Allow authenticated users to insert their own projects
DROP POLICY IF EXISTS "Creators can insert own projects" ON public."Project";
CREATE POLICY "Creators can insert own projects" 
ON public."Project" FOR INSERT 
WITH CHECK (auth.uid() = "creatorId");

-- Allow creators to update their own projects
DROP POLICY IF EXISTS "Creators can update own projects" ON public."Project";
CREATE POLICY "Creators can update own projects" 
ON public."Project" FOR UPDATE 
USING (auth.uid() = "creatorId");

-- ==========================================
-- 2. PURCHASE POLICIES
-- ==========================================

-- Allow buyers to view their own purchases
DROP POLICY IF EXISTS "Buyers can view own purchases" ON public."Purchase";
CREATE POLICY "Buyers can view own purchases" 
ON public."Purchase" FOR SELECT 
USING (auth.uid() = "buyerId");

-- Note: INSERTs for Purchase are handled by the service_role (Admin client) 
-- in the Stripe webhook, so no public INSERT policy is needed for security.
-- However, for testing, you can enable authenticated inserts:
DROP POLICY IF EXISTS "Enable authenticated purchase insert" ON public."Purchase";
CREATE POLICY "Enable authenticated purchase insert" 
ON public."Purchase" FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- 3. STORAGE POLICIES (devmark-assets bucket)
-- ==========================================

-- Ensure storage RLS is enabled
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read of thumbnails
DROP POLICY IF EXISTS "Thumbnails are public" ON storage.objects;
CREATE POLICY "Thumbnails are public" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'devmark-assets');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'devmark-assets' AND auth.role() = 'authenticated');

-- Allow users to manage (update/delete) their own files
DROP POLICY IF EXISTS "Users can manage own files" ON storage.objects;
CREATE POLICY "Users can manage own files" 
ON storage.objects FOR ALL 
USING (bucket_id = 'devmark-assets' AND (auth.uid())::text = (storage.foldername(name))[1]);
