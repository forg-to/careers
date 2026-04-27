import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Briefcase } from "lucide-react";

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  await dbConnect();
  const { id } = await params;
  const application = await Application.findById(id).populate('jobId');

  if (!application) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-12">
        <Link
          href="/admin/applications"
          className="flex items-center gap-2 text-olive-gray hover:text-near-black mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Applications
        </Link>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center text-charcoal-warm">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl serif text-near-black">{application.name}</h1>
            <p className="text-olive-gray italic">Application details</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-ivory p-6 rounded-xl ring-shadow space-y-4">
            <h3 className="text-lg serif text-near-black border-b border-border-cream pb-2">Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-olive-gray">
                <Mail size={16} className="text-stone-gray" />
                {application.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-olive-gray">
                <Briefcase size={16} className="text-stone-gray" />
                {(application.jobId as any)?.title || 'Unknown Role'}
              </div>
              <div className="flex items-center gap-3 text-sm text-olive-gray">
                <Calendar size={16} className="text-stone-gray" />
                {new Date(application.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl ring-shadow border border-border-cream space-y-8">
            <h2 className="text-2xl serif text-near-black border-b border-border-cream pb-4">Responses</h2>
            {application.answers.map((ans: any, idx: number) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-sm font-bold text-charcoal-warm uppercase tracking-wider">{ans.question}</h4>
                <div className="p-4 bg-parchment rounded-lg text-olive-gray leading-relaxed whitespace-pre-wrap font-sans">
                  {ans.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
