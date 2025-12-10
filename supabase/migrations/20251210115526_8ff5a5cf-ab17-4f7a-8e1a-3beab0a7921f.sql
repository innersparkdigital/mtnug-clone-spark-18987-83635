-- Add country column to specialists table
ALTER TABLE public.specialists 
ADD COLUMN country text NOT NULL DEFAULT 'Uganda';

-- Update comment
COMMENT ON COLUMN public.specialists.country IS 'Country where the specialist is based';