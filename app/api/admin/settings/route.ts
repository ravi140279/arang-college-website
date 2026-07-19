import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getSettings, saveSettings } from "@/lib/cms/data";
import type { SiteSettings } from "@/lib/cms/data";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getSettings());
}

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as SiteSettings;
  saveSettings(body);
  revalidatePath("/", "layout");
  return Response.json({ success: true });
}
