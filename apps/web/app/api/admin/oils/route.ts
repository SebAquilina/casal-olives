import { NextResponse } from "next/server";
import { listOils } from "@/lib/oils/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const oils = await listOils(false);
  return NextResponse.json({ ok: true, oils });
}
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { Allow: "GET, OPTIONS" } }); }
