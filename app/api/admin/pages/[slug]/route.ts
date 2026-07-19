import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getPage, savePage } from "@/lib/cms/data";
import type { PageData } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }
  return Response.json(page);
}

export async function PUT(request: Request, { params }: Props) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const body = (await request.json()) as Partial<PageData>;
  const existing = getPage(slug);
  if (!existing) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }
  const updated: PageData = { ...existing, ...body, slug };
  savePage(updated);
  revalidatePath(`/${slug}`);
  revalidatePath("/");
  return Response.json({ success: true });
}
