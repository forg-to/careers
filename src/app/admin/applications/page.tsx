import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await dbConnect();
  const applications = await Application.find({}).sort({ createdAt: -1 }).populate('jobId');

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-12">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl serif text-text-primary">Applications</h1>
        <p className="text-text-tertiary mt-2">Review submissions from potential builders.</p>
      </header>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <div className="text-center p-12 bg-bg-secondary rounded-xl ring-shadow border border-border-subtle">
            <p className="text-text-tertiary italic">No applications received yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id.toString()}
              className="bg-bg-secondary p-6 rounded-xl ring-shadow flex justify-between items-center transition-all hover:whisper-shadow border border-border-subtle"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center text-text-secondary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl serif text-text-primary">{app.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-text-tertiary">
                    <span>{app.email}</span>
                    <span>•</span>
                    <span>Applied for: {(app.jobId as any)?.title || 'Unknown Role'}</span>
                    <span>•</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/admin/applications/${app._id}`}
                className="px-6 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:brightness-95 transition-all font-medium text-sm border border-border-subtle"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
