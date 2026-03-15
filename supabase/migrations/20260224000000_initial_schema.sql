-- ==========================================
-- 1. EXTENSIONS & CLEANUP
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLES
-- ==========================================

-- Public User Profiles (Mirrors auth.users)
CREATE TABLE public."User" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  role TEXT DEFAULT 'BUYER' CHECK (role IN ('BUYER', 'SELLER', 'BOTH')),
  avatar TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Marketplace Projects
CREATE TABLE public."Project" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  "techStack" TEXT[] DEFAULT '{}',
  "demoUrl" TEXT,
  thumbnail TEXT,
  "sourceFile" TEXT,
  "creatorId" UUID REFERENCES public."User"(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Transaction History
CREATE TABLE public."Purchase" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'SUCCESS',
  "projectId" UUID REFERENCES public."Project"(id) ON DELETE SET NULL,
  "buyerId" UUID REFERENCES public."User"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Messaging
CREATE TABLE public."Message" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  "senderId" UUID REFERENCES public."User"(id) ON DELETE CASCADE,
  "receiverId" UUID REFERENCES public."User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. AUTOMATION (AUTH SYNC)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, "firstName", "lastName", role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    COALESCE(NEW.raw_user_meta_data->>'role', 'BUYER')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Purchase" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Message" ENABLE ROW LEVEL SECURITY;

-- USER POLICIES
CREATE POLICY "Public profiles are viewable by everyone" 
ON public."User" FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public."User" FOR UPDATE USING (auth.uid() = id);

-- PROJECT POLICIES
CREATE POLICY "Approved projects are viewable by everyone" 
ON public."Project" FOR SELECT USING (status = 'APPROVED' OR auth.uid() = "creatorId");

CREATE POLICY "Creators can insert own projects" 
ON public."Project" FOR INSERT WITH CHECK (auth.uid() = "creatorId");

CREATE POLICY "Creators can update own projects" 
ON public."Project" FOR UPDATE USING (auth.uid() = "creatorId");

-- PURCHASE POLICIES
CREATE POLICY "Buyers can view own purchases" 
ON public."Purchase" FOR SELECT USING (auth.uid() = "buyerId");

CREATE POLICY "Creators can view sales of their projects" 
ON public."Purchase" FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public."Project" 
    WHERE id = public."Purchase"."projectId" AND "creatorId" = auth.uid()
  )
);

-- MESSAGE POLICIES
CREATE POLICY "Users can view their own conversations" 
ON public."Message" FOR SELECT USING (auth.uid() = "senderId" OR auth.uid() = "receiverId");

CREATE POLICY "Users can send messages" 
ON public."Message" FOR INSERT WITH CHECK (auth.uid() = "senderId");
