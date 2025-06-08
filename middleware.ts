import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const protectedForAuthenticated = ["/user_registration"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (isAuthenticated && protectedForAuthenticated.includes(req.nextUrl.pathname)) {
    
    return NextResponse.redirect(new URL("/", req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user_registration"],
};
