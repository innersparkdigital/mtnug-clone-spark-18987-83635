REVOKE EXECUTE ON FUNCTION public.admin_corporate_account_overview(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.psych_confirm_order_paid(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_corporate_hr_active(uuid, uuid, boolean) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_corporate_request(uuid, text) FROM anon;