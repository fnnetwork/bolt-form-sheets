/*
  # Enable Realtime for users table

  1. Configuration Changes
    - Enable Realtime replication for the users table
    - This allows the Supabase Realtime service to listen to changes on the users table

  2. Security
    - Realtime will respect existing RLS policies
    - No additional security changes needed as RLS is already properly configured
*/

-- Enable Realtime for the users table
ALTER TABLE users REPLICA IDENTITY FULL;

-- Add the users table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE users;