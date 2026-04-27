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
          className="flex items-center gap-2 text-olive-gray hover:text-near-black mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl serif text-near-black">Applications</h1>
        <p className="text-olive-gray mt-2">Review submissions from potential builders.</p>
      </header>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <div className="text-center p-12 bg-ivory rounded-xl ring-shadow">
            <p className="text-stone-gray italic">No applications received yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id.toString()}
              className="bg-ivory p-6 rounded-xl ring-shadow flex justify-between items-center transition-all hover:whisper-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warm-sand rounded-full flex items-center justify-center text-charcoal-warm">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl serif text-near-black">{app.name}</h3>
                  <div className="flex gap-4 text-sm text-olive-gray">
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
                className="px-6 py-2 bg-warm-sand text-charcoal-warm rounded-lg hover:brightness-95 transition-all font-medium text-sm"
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
