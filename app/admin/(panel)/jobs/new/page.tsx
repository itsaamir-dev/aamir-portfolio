import type { Metadata } from "next";
import Motion from "@/components/admin/Motion";
import JobForm from "@/components/admin/JobForm";
import { DbNotConnected } from "@/components/admin/parts";
import { isDbConfigured } from "@/lib/jobs-data";

export const metadata: Metadata = { title: "New job" };
export const dynamic = "force-dynamic";

export default function NewJobPage() {
  if (!isDbConfigured) return <DbNotConnected />;
  return <Motion className="mx-auto max-w-4xl"><JobForm /></Motion>;
}
