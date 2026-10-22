# Database notes

The canonical schema is `supabase/schema.sql`. Dates are stored as `timestamptz`; local-day analytics must query with an Asia/Colombo boundary. `user_login_events` supports accurate login counts. `webhook_events` uses `(provider, provider_event_id)` for idempotency. Ordinary clients cannot modify status or entitlements.
