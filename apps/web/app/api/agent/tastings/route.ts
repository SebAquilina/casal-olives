import { NextResponse } from "next/server";
import { listAvailableSessions } from "@/lib/tastings/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from") ?? new Date().toISOString().slice(0, 10);
  const to = url.searchParams.get("to") ?? undefined;
  const sessions = await listAvailableSessions(from, to ?? undefined);
  return NextResponse.json({ ok: true, sessions });
}
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { Allow: "GET, OPTIONS" } }); }
