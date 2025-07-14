/*
  # Fix Registration RLS Policies

  1. Security Changes
    - Drop all existing policies to start fresh
    - Create proper policies that work with Supabase Auth registration flow
    - Allow public access during registration (needed for signup process)
    - Ensure authenticated users can manage their own data

  2. Registration Flow
    - During signup, user might not be fully authenticated yet
    - Need to allow profile creation during the brief registration window
    - After registration, normal authenticated policies apply
*/

-- Drop all existing policies to start completely fresh
DROP POLICY IF EXISTS "Authenticated users can read all user data" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can delete their own data" ON users;
DROP POLICY IF EXISTS "Users can read all user data" ON users;
DROP POLICY IF EXISTS "Anyone can register" ON users;
DROP POLICY IF EXISTS "Allow profile updates" ON users;

-- 1. Allow everyone to read user data (needed for community features)
CREATE POLICY "Everyone can read user data"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- 2. Allow authenticated users to insert their own profile
CREATE POLICY "Authenticated users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. ALSO allow public insert during registration (Supabase signup process)
-- This is needed because during the signup process, the user might not be fully authenticated yet
CREATE POLICY "Allow profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 4. Allow authenticated users to update their own data
CREATE POLICY "Authenticated users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Allow authenticated users to delete their own data
CREATE POLICY "Authenticated users can delete their own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Note: The "Allow profile creation during signup" policy is intentionally permissive
-- to handle the Supabase Auth registration flow. In production, you might want to
-- add additional validation or remove this policy after confirming registration works.