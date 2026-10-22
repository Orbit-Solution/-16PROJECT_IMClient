# API contracts

## Auth

- `POST /functions/v1/auth-start` → `{ phone }` → `{ ok, expires_at, resend_after }`
- `POST /functions/v1/auth-verify` → `{ phone, otp }` → secure cookie/session result

## Reading

- `POST /functions/v1/generate-reading` → `{ service, input }` → validated `{ service, title, summary, sections, disclaimer, generated_at }`

## Rahu

- `POST /functions/v1/refresh-rahu` → `{ date, location }` → stored calculated interval.

Provider URLs are intentionally not invented; Ideamart endpoint names remain environment placeholders until provider documentation and credentials are available.
