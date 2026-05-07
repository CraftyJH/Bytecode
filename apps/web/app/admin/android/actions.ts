"use server";

import { setSiteSetting } from "@/lib/site-settings";
import { revalidatePath } from "next/cache";

export async function setAndroidDownloadDisabled(disabled: boolean) {
  await setSiteSetting("android_download_disabled", disabled);
  revalidatePath("/get-the-app/android");
  revalidatePath("/admin/android");
}
