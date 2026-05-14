# Project Specs - Wild Trail Gear

## What the app does and who uses it
- A marketing and catalog site for a camping gear rental service in Panadura, Sri Lanka.
- Visitors browse gear and contact the team on WhatsApp to rent.
- No online booking or payments are handled on the site.

## Pages and user flows
- / (Home): introduces the brand, highlights featured gear, and guides users to explore or contact.
- /catalog: users filter by category, search gear, see availability, and tap Rent Now to open WhatsApp.
- /about: story, values, team, and location details to build trust.
- /contact: a simple form that opens WhatsApp with a prefilled message, plus direct contact info and FAQs.
- /admin: a secure dashboard (requires `?key=trail2026`) for managing inventory, customers, and rentals.

## Data and where it lives
- Catalog items, categories, prices, and availability are stored in Supabase (`rental_items` table).
- Customer profiles and rental transaction records are stored in Supabase (`rental_customers` and `rental_records`).
- Admin authentication is handled via Supabase Auth.
- WhatsApp number and nav links are stored in lib/constants.ts.
- Images live in Supabase Storage (bucket: `equipment`) and public/images.

## Done looks like
- All pages load and the main navigation works.
- Catalog filters, search, and availability labels work correctly.
- Admin Panel allows full CRUD on inventory, customers, and rentals.
- Stock levels automatically adjust when items are rented or returned.
- All Rent Now and WhatsApp links open the correct number.
- The build completes without errors for Vercel deployment.

