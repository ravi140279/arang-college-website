import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getHomeContent, saveHomeContent } from "@/lib/cms/data";
import type { HomeContent } from "@/lib/cms/data";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json(getHomeContent());
}

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as HomeContent;
  saveHomeContent(body);
  revalidatePath("/");
  return Response.json({ success: true });
}
