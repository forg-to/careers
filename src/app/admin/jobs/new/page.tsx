import JobForm from "@/components/JobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewJobPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-12">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl serif text-text-primary">Create New Role</h1>
        <p className="text-text-tertiary mt-2">Define the role and the questions you want to ask applicants.</p>
      </header>

      <JobForm />
    </div>
  );
}
