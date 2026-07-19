"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageEditor } from "@/components/admin/page-editor";
import { PageData } from "@/lib/site-data";

export default function EditPageAdmin() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/pages/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Page not found");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">Loading page...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-12 text-center text-red-600">
        {error || "Page not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Edit: {data.title}
        </h1>
        <p className="text-sm text-slate-600">/{data.slug}</p>
      </div>
      <PageEditor initialData={data} />
    </div>
  );
}
