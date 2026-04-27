import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  await dbConnect();
  const jobs = await Job.find({}).sort({ createdAt: -1 });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <h1 className="text-3xl serif text-near-black">Admin Dashboard</h1>
            <p className="text-olive-gray text-sm">Manage open roles at Forg.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/applications"
            className="flex items-center gap-2 px-6 py-2 bg-warm-sand text-charcoal-warm rounded-xl hover:brightness-95 transition-all font-medium"
          >
            <Eye size={20} />
            View Applications
          </Link>
          <Link
            href="/admin/jobs/new"
            className="flex items-center gap-2 px-6 py-2 bg-terracotta text-ivory rounded-xl hover:brightness-110 transition-all shadow-sm font-medium"
          >
            <Plus size={20} />
            New Role
          </Link>
        </div>
      </header>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="text-center p-12 bg-ivory rounded-xl ring-shadow">
            <p className="text-stone-gray italic">No roles created yet.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id.toString()}
              className="bg-ivory p-6 rounded-xl ring-shadow flex justify-between items-center group transition-all hover:whisper-shadow"
            >
              <div>
                <h3 className="text-xl serif text-near-black mb-1">{job.title}</h3>
                <div className="flex gap-4 text-sm text-olive-gray">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className={job.status === 'open' ? 'text-green-600' : 'text-red-500'}>
                    {job.status === 'open' ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/jobs/${job._id}/edit`}
                  className="p-2 text-olive-gray hover:text-near-black hover:bg-warm-sand rounded-lg transition-all"
                  title="Edit Role"
                >
                  <Edit size={18} />
                </Link>
                <form action={async () => {
                  "use server";
                  const { revalidatePath } = await import("next/cache");
                  await dbConnect();
                  await Job.findByIdAndDelete(job._id);
                  revalidatePath("/admin");
                }}>
                   {/* This is a simple delete for now, in a real app we'd use a safer approach */}
                  <button
                    type="submit"
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Role"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
