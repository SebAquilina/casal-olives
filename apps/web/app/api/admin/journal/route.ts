import { NextResponse } from "next/server";
import { listPosts, upsertPost } from "@/lib/journal/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await listPosts({ publishedOnly: false });
  return NextResponse.json({ ok: true, posts });
}
export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 }); }
  if (!body?.slug) return NextResponse.json({ ok: false, error: "slug_required" }, { status: 422 });
  await upsertPost(body);
  return NextResponse.json({ ok: true });
}
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } }); }
