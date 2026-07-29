# Ember & Halo

Ember & Halo is a premium, adult-only vape and hookah storefront built with Next.js and Medusa commerce services. Products, variants, regional prices, categories, collections, carts, shipping, payments, and orders use the configured Medusa Store API. A local showcase catalog remains available only as an explicitly enabled development mode.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The age gate stores verification for 30 days.

## Catalog modes

The configured Medusa catalog is the default source of truth. Set the Store API URL and publishable key:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-host.example
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_DEFAULT_REGION=in
```

`NEXT_PUBLIC_DEFAULT_REGION` is an ISO-2 country code attached to the intended Medusa region. To intentionally preview the bundled offline demo catalog, set `NEXT_PUBLIC_EMBER_HALO_LIVE_CATALOG=false`. Live checkout creates and completes Medusa carts and orders through the configured region, shipping, and payment providers.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Brand photography lives in `public/ember-halo`; the selected display, accent, and body fonts are bundled under `app/fonts` for network-independent builds.
