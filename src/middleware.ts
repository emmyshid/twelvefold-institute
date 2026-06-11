import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Marketing pages and the free reading stay public. The actual products
// (PatternOS app, certification portal, account, admin) require sign-in.
const isProtected = createRouteMatcher([
  "/read/app(.*)",
  "/portal(.*)",
  "/account(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except static files and Next internals…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?)).*)",
    // …and always run on API routes.
    "/(api|trpc)(.*)",
  ],
};
