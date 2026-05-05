-- Chat sessions, messages, and analytics events for AI Support Assistant
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT NOT NULL,
  user_agent TEXT,
  source_path TEXT,
  escalated BOOLEAN NOT NULL DEFAULT false,
  high_risk_triggered BOOLEAN NOT NULL DEFAULT false,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at);
CREATE INDEX idx_chat_sessions_created ON public.chat_sessions(created_at DESC);
CREATE INDEX idx_chat_events_type ON public.chat_events(event_type, created_at DESC);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_events ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous chat) but not read
CREATE POLICY "Anyone can create chat sessions"
  ON public.chat_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update own session metadata"
  ON public.chat_sessions FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert chat events"
  ON public.chat_events FOR INSERT WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view chat messages"
  ON public.chat_messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view chat events"
  ON public.chat_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();