ALTER TABLE public.chat_sessions
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_chat_sessions_tags
ON public.chat_sessions USING GIN(tags);