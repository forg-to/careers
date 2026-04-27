import JobForm from "@/components/JobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await dbConnect();
  const { id } = await params;
  const job = await Job.findById(id);

  if (!job) {
    redirect("/admin");
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-12">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-olive-gray hover:text-near-black mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl serif text-near-black">Edit Role</h1>
        <p className="text-olive-gray mt-2">Update the role details or application questions.</p>
      </header>

      <JobForm initialData={JSON.parse(JSON.stringify(job))} isEdit />
    </div>
  );
}
