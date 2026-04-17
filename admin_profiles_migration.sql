-- Add is_admin column to profiles table
-- Run this SQL in your Supabase SQL editor to add admin functionality

ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Set initial admin user (you can change the user_id to your admin user's UUID)
UPDATE profiles 
SET is_admin = TRUE 
WHERE user_id = 'YOUR_ADMIN_USER_ID_HERE';

-- Grant necessary permissions
-- This ensures only admin users can access admin functions
a