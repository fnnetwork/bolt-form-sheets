/*
  # Clean Authentication System - Start Fresh

  1. Database Changes
    - Drop all existing RLS policies
    - Add WhatsApp field to users table
    - Create simple, working RLS policies
    - Ensure proper auth alignment

  2. New Fields
    - Add whatsapp field for phone numbers

  3. Security
    - Simple RLS policies that actually work
    - Allow email/password auth with password recovery
    - No email confirmation required
*/

-- Drop all existing RLS policies to start completely fresh
DROP POLICY IF EXISTS "Everyone can read user data" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON users;
DROP POLICY IF EXISTS "Authenticated users can update their own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can delete their own data" ON users;

-- Add WhatsApp field to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE users ADD COLUMN whatsapp text;
  END IF;
END $$;

-- Create simple, working RLS policies

-- 1. Allow everyone to read user data (needed for community features)
CREATE POLICY "Everyone can read user data"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- 2. Allow profile creation during signup
CREATE POLICY "Allow profile creation during signup"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 3. Allow authenticated users to update their own data
CREATE POLICY "Authenticated users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Allow authenticated users to delete their own data
CREATE POLICY "Authenticated users can delete their own data"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);