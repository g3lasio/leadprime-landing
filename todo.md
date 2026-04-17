# LeadPrime Landing — TODO

## La Noche Chyrris Event Page

- [x] Upgrade project from static to web-db-user template (tRPC + Express + DB)
- [x] Create event_registrations table in Neon PostgreSQL DB
- [x] Build /evento page (EventoPage.tsx) with 8 sections: Hero, Problem, Timeline, Benefits, Host, FAQ, Registration form
- [x] Build /admin/evento dashboard (AdminEventoPage.tsx) with PIN auth, stats, filters, CSV export
- [x] Build server/routers/evento.ts with register mutation, duplicate email check, USA phone validation, attendee code generation
- [x] Send confirmation email to registrant via Resend (noreply@chyrris.com)
- [x] Send notification email to gelasio@chyrris.com on new registration via Resend
- [x] Send Manus push notification to owner on new registration
- [x] Add La Noche Chyrris link to main Navbar (desktop + mobile, gold color)
- [x] Register /evento and /admin/evento routes in App.tsx
- [x] Upload hero background image and Gelasio photo to CDN
- [x] EVENTO_ADMIN_PIN env var set (6289)
- [x] RESEND_API_KEY env var set
- [x] NEON_DATABASE_URL env var set

## Main Landing Page

- [x] Hero section with LeadPrime branding
- [x] Features section (12 features)
- [x] Network section
- [x] Industry tabs (6 industries)
- [x] AI Agent Mervin section
- [x] Pricing section (2 plans: $15 base + $249 Elite)
- [x] Footer
- [x] Dark theme with Space Grotesk + Inter typography

## Pending / Future

- [ ] Test form submission in production (after deployment)
- [ ] Confirm event date (28 or 29 May) with Gelasio — currently shows "29 de Mayo"
- [ ] Add more cities to the registration form dropdown if needed
