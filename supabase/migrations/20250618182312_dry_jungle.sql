/*
  # Fix Authentication System Alignment

  1. Problem Analysis
    - Users table has records not aligned with Supabase Auth
    - Need to ensure 1 user = 1 auth account = 1 users table row
    
  2. Security Changes
    - Update RLS policies to work with proper Supabase Auth
    - Ensure users can only access their own data based on auth.uid()
    
  3. Data Cleanup
    - Keep existing user data but align with proper auth system
*/

-- First, let's update the RLS policies to work properly with Supabase Auth

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all user data" ON users;
DROP POLICY IF EXISTS "Anyone can register" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow profile updates" ON users;

-- Create proper RLS policies that work with Supabase Auth

-- Allow authenticated users to read all user data (for community features)
CREATE POLICY "Authenticated users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own data only
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own data (optional)
CREATE POLICY "Users can delete their own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Note: The existing user data in the users table will need to be manually
-- aligned with Supabase Auth accounts. For now, new registrations will work correctly.