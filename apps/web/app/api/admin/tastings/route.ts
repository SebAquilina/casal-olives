import { NextResponse } from "next/server";
import { listSessions, listBookings } from "@/lib/tastings/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const sessions = await listSessions({ activeOnly: false });
  const bookings = await listBookings();
  return NextResponse.json({ ok: true, sessions, bookings });
}
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { Allow: "GET, OPTIONS" } }); }
