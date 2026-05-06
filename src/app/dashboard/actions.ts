"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/dal";
import { deleteRecord } from "@/lib/crypto/vault";

export async function deleteVaultRecord(formData: FormData) {
  const user = await requireUser();
  const recordId = formData.get("recordId");
  if (typeof recordId !== "string" || !recordId) return;
  await deleteRecord(user.id, recordId);
  revalidatePath("/dashboard");
}
