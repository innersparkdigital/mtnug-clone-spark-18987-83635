alter table public.manual_password_reset_requests
  add column if not exists admin_notified_at timestamptz,
  add column if not exists admin_notification_error text;
