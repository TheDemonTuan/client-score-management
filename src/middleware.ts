import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const requestHeaders = new Headers(request.headers);
  const jwt_token = request.cookies.get("t&d_token");
  requestHeaders.set("x-pathname", pathname);
  
  if (jwt_token?.value) {
    requestHeaders.set("x-token", jwt_token.value);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
