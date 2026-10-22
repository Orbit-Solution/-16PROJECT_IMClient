# Architecture

The frontend is a Vite-served vanilla JavaScript SPA. `router.js` supports direct route navigation, `app.js` composes public and admin views, and service modules isolate authentication, Rahu calculation, AI, Supabase, and Ideamart concerns.

The browser demo intentionally degrades to clearly labelled mock behavior when environment credentials are absent. Production requests must move OTP, session creation, entitlement checks, AI calls, admin actions, and webhook verification into server-side Supabase Edge Functions.
