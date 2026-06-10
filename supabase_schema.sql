-- SQL SCHEMA FOR SUPABASE INTEGRATION
-- Run this in your Supabase SQL Editor

-- 1. Create Profiles Table (syncs with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    has_paid BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Tax Calculations Table (holds step-by-step inputs)
CREATE TABLE IF NOT EXISTS public.tax_calculations (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    age_category TEXT DEFAULT 'below60',
    monthly_take_home NUMERIC DEFAULT 0,
    other_income NUMERIC DEFAULT 0,
    basic_salary NUMERIC DEFAULT 0,
    hra_received NUMERIC DEFAULT 0,
    pf_deduction NUMERIC DEFAULT 0,
    pays_rent BOOLEAN DEFAULT FALSE,
    monthly_rent NUMERIC DEFAULT 0,
    city TEXT DEFAULT '',
    is_metro BOOLEAN DEFAULT FALSE,
    has_80c BOOLEAN DEFAULT FALSE,
    total_80c NUMERIC DEFAULT 0,
    has_health_insurance BOOLEAN DEFAULT FALSE,
    health_self NUMERIC DEFAULT 0,
    health_parents NUMERIC DEFAULT 0,
    parents_senior BOOLEAN DEFAULT FALSE,
    has_home_loan BOOLEAN DEFAULT FALSE,
    home_loan_interest NUMERIC DEFAULT 0,
    has_nps BOOLEAN DEFAULT FALSE,
    nps_amount NUMERIC DEFAULT 0,
    has_education_loan BOOLEAN DEFAULT FALSE,
    education_loan_interest NUMERIC DEFAULT 0,
    has_professional_tax BOOLEAN DEFAULT FALSE,
    professional_tax_amount NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on Tax Calculations
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;

-- 3. Trigger Function: Automatically create profile on new sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, has_paid, is_active, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Valued User'),
        NEW.email,
        FALSE,
        TRUE,
        'user'
    );
    
    -- Also initialize an empty tax calculations row
    INSERT INTO public.tax_calculations (id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS Policies Configuration

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Allow public read access to active profiles" 
    ON public.profiles FOR SELECT 
    USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Allow users to read their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users to insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users to update their own profile name" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow admin to manage all profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- Tax Calculations policies
CREATE POLICY "Allow users to read their own tax data" 
    ON public.tax_calculations FOR SELECT 
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users to insert their own tax data row" 
    ON public.tax_calculations FOR INSERT 
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users to update their own tax data" 
    ON public.tax_calculations FOR UPDATE 
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow admin to manage all tax calculations"
    ON public.tax_calculations FOR ALL
    USING (public.is_admin());
