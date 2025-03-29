import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Example middleware logic
  console.log("Middleware triggered", req.url);
  return NextResponse.next();
}
