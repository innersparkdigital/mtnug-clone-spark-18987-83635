# Client portal security migration — audit and plan (no changes made)

## What the audit found (checked today, read-only)

- The portal link `/my-progress/:slug/:token` loads everything with `client_snapshot(_token uuid)`. This function runs with elevated rights and **anonymous visitors can call it**. It returns the client record, assignments, submissions and therapist reactions **before** any passcode check. The passcode screen is only a cover in the browser.
- 13 homework tools (Activity, Reframing, Custom Questions, Gratitude, Life Skills, Emotion Diary x2, Homework x2, Safety Check-in, Scale, Self-care, Session Reflection x2, Support Network, Thought Record x2) save through `save_tool_submission(_token, ...)`. Anonymous visitors can call it too, and it never asks for the passcode.
- Data: 37 clients, 10 have a passcode, 1 has no email and no phone, 4 emails and 8 phone numbers are shared by more than one client record.

### Every function that works with the token alone (all anonymous-callable)
| Function | Risk |
|---|---|
| client_snapshot(uuid) | Reads everything before the passcode |
| save_tool_submission(uuid, ...) | Writes without the passcode |
| get_client_by_token(uuid) | Reads the client record |
| get_client_reactions_by_token(uuid) | Reads therapist reactions |
| set_client_passcode(uuid, text) | **Anyone with the link can set a passcode if none exists yet** (27 clients) |
| set_or_complete_client_passcode(text, text) | Same risk; also finishes resets |
| verify_client_passcode(uuid, text) | Older version; no attempt limit to be confirmed |
| verify_client_portal_credential(text, text) | Current check; returns only yes/no, no session |
| complete_client_temporary_reset(text, uuid, text) | Reset finish tied to the token |

Out of scope but flagged: `admin_client_detail`, `admin_list_all_clients` and `therapist_client_overview` can also be called anonymously. Step 1 checks whether they test `has_role` internally. The consent link functions (`get_client_consent`, `confirm_client_consent`) are separate and stay as they are.

### Browser-side fallbacks that must go
- `ClientPortal.tsx` falls back from `verify_client_portal_credential` to `verify_client_passcode`, and from `set_or_complete_client_passcode` to `set_client_passcode`.
- Unlocking is kept only in the browser. Nothing from the server proves the client is signed in.
- Both portal routes in `App.tsx`.

## Target design

```text
Homepage "Client login" -> /client-login
  email or phone + passcode --> client_login() --> session token (random, hashed on the server)
  every portal call sends the session token --> checked on the server, idle timer refreshed
  Logout -> client_logout() deletes the session on the server
Therapist/admin "Send invite" -> one-time link (48h, used once) -> /client-setup/:invite -> set passcode -> signed in
Old /my-progress links -> "Please sign in" page, no data loaded
```

- **Login:** the client enters email (not case-sensitive) or phone (E.164 format) plus passcode. The login looks up every record with that contact and checks the passcode against each one. If exactly one matches, it signs in. If several match, the client picks from a list of first names only; this list shows only after the passcode is correct. Every failure shows the same message. Failed attempts are limited by contact and by client (for example, a lock after 5 failures within 15 minutes).
- **Client with no email or phone:** cannot log in until staff add a contact, or until they use an invite link. The link works only once, so there is no permanent login.
- **Sessions:** a new table `client_portal_sessions` stores the client id, a hash of the token, when it was created, when it was last used, and when it was revoked. It has no public access. Sessions expire after 30 minutes without activity and after 12 hours at most. Signing in again, a passcode reset, or an admin action can revoke all sessions. The browser keeps the token in sessionStorage only.
- **Invites:** a new table `client_portal_invites` stores a hash of the invite, when it expires and when it was used. Only therapists or admins can issue them, and they can share the link on WhatsApp or by email. Clients who already have a passcode need no invite.
- **New server functions**, each taking a session token: `client_portal_snapshot`, `client_save_submission`, `client_get_reactions`, `client_logout`, `client_touch`. Invite functions: `client_accept_invite(invite, passcode)`, and `issue_client_invite(client_id)`, which needs a staff sign-in.
- **Existing reset flow:** keep the manual-password-reset service and `issue_client_temporary_passcode`. The temporary passcode now works on `/client-login`, and the client must choose a new passcode before the session opens. `complete_client_temporary_reset` changes to take a session instead of the old link token.

## Zero-data-loss rollout

1. **Read-only checks:** review the full text of each function listed above and back up `therapist_clients`, assignments, submissions, reactions and consent (row counts plus a checksum).
2. **Migration A (additive only):** add the sessions table, the invites table, the attempt log and the new functions. Keep every existing column and row, including `access_token`, which stays for internal reference. Only staff roles and service_role get access; anon can call only login, invite acceptance and session-based functions.
3. **Frontend:** add the `/client-login` page, the homepage and header button, the `/client-setup/:invite` page, and a portal that uses sessions (logout button, 30-minute idle timer, and a return to login whenever the server rejects the session). Update all 13 tools to call `client_save_submission`. Add a "Send portal invite" button in the admin tracker and the therapist roster. Remove the fallbacks. Old links show the "Please sign in" page.
4. **Publish the frontend, then Migration B:** block anonymous access to `client_snapshot`, `save_tool_submission`, `get_client_by_token`, `get_client_reactions_by_token`, `set_client_passcode`, `set_or_complete_client_passcode`, `verify_client_passcode`, `verify_client_portal_credential` and the old version of `complete_client_temporary_reset`. The functions are not deleted, so the change can be undone with a single command.
5. **Post-checks:** compare row counts and checksums with step 1, then run the tests below.
6. **Communication:** send invites to the 27 clients without a passcode. The 10 with a passcode sign in using their contact.

## Negative tests (must fail or be refused)
- Anonymous calls to every old function with a real token return a permission error, including a direct request with only the public key.
- An old link loads no names, notes or submissions (checked in the network responses).
- Login with a wrong passcode, an unknown contact, or a shared contact with a wrong passcode gives the same message, with no hint that the account exists. The 6th attempt is locked.
- Using an invite twice, after 48 hours, or with a made-up code is refused.
- A session used after logout, after 31 idle minutes, or after an admin revokes it is refused for both reading and saving.
- Client A's session cannot read or write Client B's `assignment_tool_id`.
- A new login on the same account can revoke the old sessions.
- Positive checks: data is unchanged, therapist and admin views are unchanged, consent links still work, and the reset flow still works from request to temporary passcode to new passcode to signed in.

## Open decisions
- Shared contacts: show a first-name picker after the passcode is correct (proposed), or require staff to make contacts unique first?
- Invite lifetime: 48 hours (proposed)?
- Maximum session length: 12 hours (proposed)?
