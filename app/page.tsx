// This file exists only to satisfy the Next.js root layout requirement.
// The real "/" page lives in app/(app)/page.tsx and is served through
// the authenticated layout. The middleware redirects unauthenticated
// users to /login before this ever renders.
export { default } from './(app)/page'
