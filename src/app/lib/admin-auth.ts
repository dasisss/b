import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

// Demo credentials. Override via .env (ADMIN_PASSWORD, ADMIN_SECRET) in
// production. The default is intentionally simple for local evaluation.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "lp-admin-dev-secret";

export const ADMIN_COOKIE = "lp_admin_sess";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function sign(payload: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const body = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const payload = Buffer.from(body).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (sign(payload) !== sig) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function checkPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}

// Returns true if the request carries a valid admin session cookie.
export function requireAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}
