import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.unsafeMetadata?.role ||
    sessionClaims?.publicMetadata?.role) as string | undefined;

  if (userId && isOnboardingRoute(req)) {
    if (role === "market") {
      return NextResponse.redirect(new URL("/dashboard/market", req.url));
    }
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
  }

  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userId && isProtectedRoute(req) && !role) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
