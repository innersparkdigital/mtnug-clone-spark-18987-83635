REVOKE ALL ON public.client_portal_sessions, public.client_portal_invites, public.client_login_attempts FROM anon, PUBLIC;
REVOKE ALL ON public.client_login_attempts FROM authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.client_portal_sessions, public.client_portal_invites FROM authenticated;
GRANT SELECT ON public.client_portal_sessions, public.client_portal_invites TO authenticated;
REVOKE EXECUTE ON FUNCTION public.issue_client_invite(uuid), public.revoke_client_sessions(uuid) FROM anon;