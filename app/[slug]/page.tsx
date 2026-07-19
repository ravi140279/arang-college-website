import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/page-renderer";
import { getAllPageSlugs, getAllPages } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPageSlugs().map((slug) => ({ slug }));
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const pages = getAllPages();
  const page = pages[slug];

  if (!page) {
    notFound();
  }

  return <PageRenderer page={page} />;
}
