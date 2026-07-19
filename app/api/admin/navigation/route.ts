import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getNavigation, saveNavigation } from "@/lib/cms/data";
import type { NavGroup } from "@/lib/site-data";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getNavigation());
}

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as NavGroup[];
  saveNavigation(body);
  revalidatePath("/", "layout");
  return Response.json({ success: true });
}
