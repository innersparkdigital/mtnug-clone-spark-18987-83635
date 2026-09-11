REVOKE EXECUTE ON FUNCTION public.admin_generate_client_consent_token(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_generate_client_consent_token(uuid) TO authenticated;