/*
  # Create users table for A+BDB SP Game

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, user's name/nickname)
      - `email` (text, unique, user's email)
      - `sector` (text, optional, user's stadium sector)
      - `bio` (text, optional, user's bio)
      - `avatar` (text, optional, user's avatar URL)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to read all users
    - Add policies for users to update their own data
    - Add policies for users to insert their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text,
  bio text,
  avatar text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read all users (for community features)
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy to allow users to insert their own data
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();