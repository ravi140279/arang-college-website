import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getActiveTheme, saveActiveTheme } from "@/lib/cms/data";
import { themes } from "@/lib/themes";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ activeTheme: getActiveTheme() });
}

export async function PUT(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { themeId } = (await request.json()) as { themeId: string };
  if (!themes.some((t) => t.id === themeId)) {
    return Response.json({ error: "Invalid theme" }, { status: 400 });
  }
  saveActiveTheme(themeId);
  revalidatePath("/", "layout");
  return Response.json({ success: true });
}
