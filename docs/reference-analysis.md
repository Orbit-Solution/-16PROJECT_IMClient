# Reference analysis — Divigamana implementation

Date: 2026-10-22 (Asia/Colombo)

The requested reference URL, `https://divimaga.com/`, was not accessible to the available browser inspection tool. No claim below represents a direct observation from the reference site. The implementation therefore uses the supplied master brief as its verified product specification and marks unavailable workflows as configurable.

| Service | Fields | Validation | Steps | Result display | Verification status |
|---|---|---|---|---|---|
| Birth chart | Name, gender, birth date/time/place, district | Required fields; ISO date | Service → form → phone OTP → reading | Structured Sinhala sections | Not accessible; configurable template |
| Daily guidance | Name, birth date | Required fields; ISO date | Service → form → phone OTP → reading | Structured Sinhala sections | Not accessible; configurable template |
| Relationship compatibility | Two names and birth details | Required fields; ISO dates | Service → form → auth → entitlement → reading | Structured Sinhala sections | Not accessible; configurable template |
| Career path | Name, birth details, career focus | Required fields; ISO date | Service → form → auth → entitlement → reading | Structured Sinhala sections | Not accessible; configurable template |
| Auspicious time | Name, birth date, event date/type | Required fields; ISO dates | Service → form → phone OTP → reading | Structured Sinhala sections | Not accessible; configurable template |

## Brief-derived interaction notes

- Sinhala-first header, service access, date, Rahu Time, auth/profile control, and mobile menu are implemented.
- Phone authentication uses a four-position development OTP UI with configurable provider adapter boundary. The demo code is `1234` and is visibly labelled as demo mode.
- Results show a title, summary, sections, disclaimer, generation timestamp, and service context.
- Admin screens are present as a development workspace view. Production authorization and mutations belong in Supabase Edge Functions and RLS-protected RPCs.

## Differences and limits

- Exact reference colors, copy, service list, form fields, validation, authentication UI, and result layout could not be verified because the reference host was inaccessible.
- Sunrise/sunset values are configured sample data in the browser template. Production should use a dependable astronomical source and persist daily values in `rahu_calendar`.
- The mock adapter does not represent real Ideamart delivery, payment, or subscription confirmation.
