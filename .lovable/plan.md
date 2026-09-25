# Add country-code phone selector to remaining forms

Replace plain phone boxes with the shared country-code phone field so every number is saved in full international format.

## Forms to update
- Contact page
- Donate Therapy
- Trainings registration
- For Professionals application
- B2B screening booking
- Doctor referral form (patient phone)
- Doctor login (phone lookup)

## Behaviour
- Country preselected from the visitor's page/locale, same as booking forms.
- Submit blocked with a friendly message if the number is invalid.
- Existing saved numbers are left untouched.

## Technical details
- Swap each `type="tel"` input for `PhoneField`, validate with `isValidE164` before insert.
- Doctor login: try the E.164 value, then fall back to the legacy raw format in `get_doctor_email_by_phone` so doctors registered with local numbers can still sign in.
