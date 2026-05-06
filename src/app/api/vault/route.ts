import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/dal";
import { sealAndStore, listForUser } from "@/lib/crypto/vault";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024;

export async function GET() {
  const user = await requireUser();
  const records = await listForUser(user.id);
  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data with a `file` field." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing `file` field." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File exceeds the 25 MB limit." },
      { status: 413 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ref = await sealAndStore({
    userId: user.id,
    data: buf,
    contentType: file.type || undefined,
    filename: file.name || undefined,
  });

  return NextResponse.json({ record: ref }, { status: 201 });
}
