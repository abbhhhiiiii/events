# Premium Public Website Implementation Notes

The public website is implemented in `apps/web` with a production-oriented component structure.

## Performance

- App Router Server Components are used for pages.
- ISR is enabled with `revalidate = 300`.
- Next Image optimization is used for hero, card, speaker, and gallery images.
- Newsletter is dynamically imported.
- Optional detail sections render only when data exists.
- SEO routes include `sitemap.ts` and `robots.ts`.

## Responsive Approach

- Desktop and large desktop use wide editorial grids.
- Laptop/tablet collapse event and speaker grids to two columns.
- Mobile uses a dedicated drawer menu, single-column sections, compact hero spacing, and stacked booking panels.

## Event Detail Sections

Supported sections:

- Hero image or video
- Date, time, location
- Sticky navigation tabs
- Overview
- Media kit
- Agenda
- Speakers
- Sponsors
- Venue
- General information
- Contact us
- Book event

## Future Production Work

- Connect `apps/web/lib/events.ts` to the API/database repository.
- Add authentication and role checks to `apps/admin`.
- Implement payment provider integration.
- Generate real ticket PDFs or wallet passes.
- Add sync service under `apps/api/src/services/sync`.
