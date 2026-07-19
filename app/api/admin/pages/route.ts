import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/cms/auth";
import { getAllPages, savePage, deletePage } from "@/lib/cms/data";
import type { PageData } from "@/lib/site-data";

export async function GET() {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pages = getAllPages();
  const list = Object.values(pages).map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    heroTag: p.heroTag,
  }));
  return Response.json(list);
}

export async function POST(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as PageData;

  if (!body.slug || !body.title) {
    return Response.json(
      { error: "slug and title are required" },
      { status: 400 }
    );
  }

  // Sanitize slug
  const slug = body.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const page: PageData = { ...body, slug };
  savePage(page);
  revalidatePath(`/${slug}`);
  revalidatePath("/");
  return Response.json({ success: true, slug });
}

export async function DELETE(request: Request) {
  if (!(await verifySession())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = (await request.json()) as { slug: string };
  const removed = deletePage(slug);
  if (!removed) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }
  revalidatePath(`/${slug}`);
  revalidatePath("/");
  return Response.json({ success: true });
}
