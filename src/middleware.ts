import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // const isAuthenticated = req.cookies.get("isAuthenticated")?.value === "true";

  // if (pathname.startsWith("/dashboard")) {
  //   if (!isAuthenticated) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  // if (isAuthenticated && pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
}
 
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }