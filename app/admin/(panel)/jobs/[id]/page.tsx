import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Motion from "@/components/admin/Motion";
import JobForm from "@/components/admin/JobForm";
import Symbol from "@/components/admin/Symbol";
import { DbNotConnected } from "@/components/admin/parts";
import { getJobById, isDbConfigured } from "@/lib/jobs-data";

export const metadata: Metadata = { title: "Edit job" };
export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: { id: string } }) {
  if (!isDbConfigured) return <DbNotConnected />;
  const id = Number(params.id);
  const job = Number.isInteger(id) && id > 0 ? await getJobById(id) : null;
  if (!job) notFound();

  return (
    <Motion className="mx-auto max-w-4xl space-y-4">
      {job.status !== "draft" && (
        <a data-anim href={`/jobs/${job.slug}`} target="_blank" rel="noopener noreferrer"
           className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-md-outline px-4 text-sm font-medium text-md-primary">
          <Symbol name="open_in_new" size={18} /> View on site
        </a>
      )}
      <JobForm job={job} />
    </Motion>
  );
}
