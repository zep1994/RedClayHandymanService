# Red Clay Home Services

A responsive handyman website with services, project inspiration filters, FAQs, a two-step estimate flow, and mobile click-to-call.

## Demo behavior

The owner requested fictional contact details. The phone number `(202) 555-0148` is a reserved fictional number. Clicking it opens the device dialer; there is no live business line.

Booking is explicitly a demo: required fields are validated, and submission displays a sample confirmation/reference. No email is sent, no appointment is booked, and form data remains only in page memory. It clears when the page reloads. Use sample details.

Gallery images are labeled stock inspiration from Unsplash. There are no fabricated reviews, customer projects, license claims, or business statistics.

## Development

Run `npm install`, then `npm run dev`. Run `npm run build` to export the site to `out`.

## Cloudflare Pages

Create a **Pages** project connected to your GitHub repository. Use these settings:

- Production branch: `main`
- Framework preset: `None`
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: blank
- Environment variable: `NODE_VERSION=22`

`out` is a directory, not a deploy command. If the dashboard asks for a deploy command, you are in the Workers setup; return and choose Pages.

Keep the root `functions` directory in your repository for future live email delivery. Deploy through Git or `npx wrangler pages deploy out --project-name YOUR_PROJECT_NAME` from the root to include Pages Functions.

## Moving to a real business

Replace the phone in `src/app/page.js`, supply a real service area, add authentic project photos, and update the privacy policy. No real credentials are required for the current demo.

A reusable email endpoint is supplied at `functions/api/contact.js`. To enable real delivery, configure `RESEND_API_KEY` (secret), `CONTACT_FROM_EMAIL` (sender on a verified Resend domain), and `CONTACT_TO_EMAIL` (recipient) in Cloudflare Pages, then redeploy. The current form intentionally does not call that endpoint. Replace its simulated submit handler with a POST to `/api/contact` when ready to accept real requests, and show success only after a successful response. Optional date and project-size fields are supported by the endpoint.

Run `node scripts/verify-contact.mjs` after building for endpoint and export checks.
