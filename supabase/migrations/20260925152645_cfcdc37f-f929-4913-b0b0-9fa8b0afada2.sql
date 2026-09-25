REVOKE EXECUTE ON FUNCTION public.admin_list_ad_sales_leads() FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_update_ad_sales_lead(uuid,text,numeric,timestamptz) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_send_paid_client_to_whatsapp_sales(uuid,text,text,numeric,timestamptz,text,text) FROM anon;