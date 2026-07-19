"use client";

import { PageEditor } from "@/components/admin/page-editor";

export default function NewPageAdmin() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-900">
          Create New Page
        </h1>
        <p className="text-sm text-slate-600">
          Add a new content page to the website
        </p>
      </div>
      <PageEditor isNew />
    </div>
  );
}
