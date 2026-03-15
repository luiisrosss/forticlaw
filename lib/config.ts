/**
 * Feature flags & app-wide config.
 * Toggle NEXT_PUBLIC_WAITLIST_MODE in your .env to switch modes:
 *   true  → waitlist landing (email capture, no signup)
 *   false → launch landing (sign-up CTA via Clerk)
 */
export const WAITLIST_MODE = process.env.NEXT_PUBLIC_WAITLIST_MODE !== "false"
