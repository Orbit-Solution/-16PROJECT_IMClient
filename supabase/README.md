# Supabase setup

Run `schema.sql` followed by `seed.sql` in a development project. The schema is designed for server-side Edge Functions to create users, OTP requests, sessions, requests, results, and audit events. The browser receives only the public anon key and may read RLS-approved rows.

Required server functions:

- `auth-start`: normalize phone, upsert `NUMBER_ONLY`, hash OTP, rate-limit requests, and call the Ideamart adapter.
- `auth-verify`: verify the hashed OTP server-side, set `ACTIVE`, record a login event, and issue a secure session.
- `generate-reading`: check ownership/entitlement, call Alibaba only from the server, validate result JSON, and write usage logs.
- `user-management`: call `admin_block_user` / `admin_unblock_user` after server-side role checks.
- `subscription-webhook`: verify provider signature and idempotency key before changing entitlement.
- `refresh-rahu`: compute sunrise/sunset-derived periods and upsert by date/location.

Do not put `SUPABASE_SERVICE_ROLE_KEY`, provider secrets, OTP hashes, or session secrets in the Vite bundle. `SUPABASE_JWT_SECRET` is optional and depends on the selected server session architecture.
