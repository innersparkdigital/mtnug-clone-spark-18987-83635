
-- Drop the existing type check constraint to allow more specialist types
ALTER TABLE specialists DROP CONSTRAINT IF EXISTS specialists_type_check;
