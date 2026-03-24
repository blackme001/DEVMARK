-- SECURITY PATCH FOR PHASE 10: PUBLIC PROFILES & MESSAGING
-- Run these in your Supabase SQL Editor

-- ==========================================
-- 1. PUBLIC USER PROFILES
-- ==========================================

-- Allow anyone to read basic profile info for ANY user (required for storefronts)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public."User";
CREATE POLICY "Public profiles are viewable by everyone" 
ON public."User" FOR SELECT 
USING (true);

-- ==========================================
-- 2. MESSAGING SECURITY
-- ==========================================

-- Allow anyone (authenticated) to send messages
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public."Message";
CREATE POLICY "Authenticated users can send messages" 
ON public."Message" FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND (auth.uid() = "senderId" OR "senderId" IS NULL));

-- Allow users to see messages they SENT or RECEIVED
DROP POLICY IF EXISTS "Users can view their own messages" ON public."Message";
CREATE POLICY "Users can view their own messages" 
ON public."Message" FOR SELECT 
USING (auth.uid() = "senderId" OR auth.uid() = "receiverId");

-- ==========================================
-- 3. PROJECT VISIBILITY (Ensuring Approved Projects are public)
-- ==========================================

DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public."Project";
CREATE POLICY "Projects are viewable by everyone" 
ON public."Project" FOR SELECT 
USING (status = 'APPROVED' OR auth.uid() = "creatorId");
