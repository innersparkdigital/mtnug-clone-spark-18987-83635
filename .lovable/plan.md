# Client consent links and live status

## Outcome
Add a secure consent workflow to each Therapy Session Tracker client. Admin can generate and share a private WhatsApp link; the client can confirm without signing in; Admin and the assigned therapist see Pending/Signed status update automatically.

## Build
1. **Secure consent records**
   - Add `consent_token`, `consent_signed`, and `consent_signed_at` to `therapist_clients`.
   - Generate a cryptographically random, unique token only through an admin-authorized database function.
   - Add tightly scoped public functions: one returns only the client name, therapist name, and consent state for a valid token; another records confirmation and the server timestamp.
   - Expose consent status through the existing admin and therapist client-list functions, while preserving their current authorization rules.
   - Enable live client-record updates so authenticated Admin and Therapist views refresh without manual action.

2. **Admin Therapy Session Tracker**
   - Add a compact Pending/Signed consent badge to each client row.
   - Add a per-client **Generate Link** action in the expanded Actions area.
   - On generation, copy the link and offer a WhatsApp share action using the client’s saved phone number.
   - Subscribe to consent changes and refresh the affected tracker data automatically.

3. **Client consent page**
   - Add a standalone `/consent/:token` page personalized only with that client’s name and therapist’s name.
   - Show a clearly labeled placeholder consent block requiring clinical/compliance approval before launch.
   - Add the required single consent checkbox and a Confirm button disabled until checked.
   - Record confirmation using server time, show a completion state, prevent duplicate confirmation, and mark the page `noindex`.
   - Keep unrelated client/session information out of the public response and page.

4. **Therapist dashboard**
   - Add Pending/Signed consent badges on each therapist client card and in the client detail view.
   - Subscribe only to the signed-in therapist’s client changes and refresh automatically after confirmation.

## Validation
- Use one temporary test client to generate a consent link and verify the URL contains only a random token.
- Open the link in a fresh signed-out browser context and verify the correct client and therapist names with no extra client details.
- Confirm the button is disabled before checking consent, then sign and verify the recorded timestamp.
- Keep Admin and Therapist views open and verify both change from Pending to Signed without manual refresh.
- Remove the temporary test data after validation and run the focused type/build checks.

## Important launch note
The consent wording will remain conspicuously marked as placeholder text. InnerSpark’s clinical/compliance lead must supply and approve the final language before this workflow is used with real clients.
