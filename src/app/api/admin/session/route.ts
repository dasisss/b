import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Returns whether the current request carries a valid admin session.
export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: requireAdmin(req) });
}
