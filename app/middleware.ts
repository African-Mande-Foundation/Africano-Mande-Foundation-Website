export { default } from "next-auth/middleware";

//require auth for these pages
export const config = {
  matcher: ["/membership/:path*"],
};
