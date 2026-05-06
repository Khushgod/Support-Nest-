import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/dal";
import { openAndDecrypt, deleteRecord } from "@/lib/crypto/vault";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ recordId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const user = await requireUser();
  const { recordId } = await ctx.params;
  try {
    const data = await openAndDecrypt(user.id, recordId);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "content-type": "application/octet-stream",
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await requireUser();
  const { recordId } = await ctx.params;
  await deleteRecord(user.id, recordId);
  return NextResponse.json({ ok: true });
}
