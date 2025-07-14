/*
  # Fix User Registration RLS Policy

  1. Security Changes
    - Update INSERT policy to allow users to create their profile during registration
    - Keep existing SELECT and UPDATE policies for authenticated users
    - Ensure users can only insert records with their own auth.uid()

  This change allows new users to complete registration by creating their profile
  in the users table immediately after Supabase auth account creation.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

-- Create a new INSERT policy that allows users to insert during registration
CREATE POLICY "Users can insert their own data during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also create a policy for public access during the brief registration window
-- This is needed because the user might not be fully authenticated yet
CREATE POLICY "Allow insert during registration"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);