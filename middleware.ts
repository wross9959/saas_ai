import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const IsPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
]);

const IsSignUpRoute = createRouteMatcher([
  "/sign-up(.*)",
]);

export default clerkMiddleware( async ( auth, req ) => {;
  const userAuth = await auth();
  const { userId } = userAuth;

  const { pathname, origin} = req.nextUrl;

  if (!IsPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  if (IsSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  return NextResponse.next();

});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};