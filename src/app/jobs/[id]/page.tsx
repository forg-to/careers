import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Clock } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";

export default async function JobPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();
  const { id } = await params;
  const job = await Job.findById(id);

  if (!job || job.status === "closed") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-parchment py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-olive-gray hover:text-near-black mb-8 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to all roles
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-cream">
            <div>
              <h1 className="text-5xl serif text-near-black mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-6 text-olive-gray">
                <span className="flex items-center gap-2 font-medium">
                  <Briefcase size={18} className="text-stone-gray" />
                  {job.department}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <MapPin size={18} className="text-stone-gray" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Clock size={18} className="text-stone-gray" />
                  {job.type}
                </span>
              </div>
            </div>
            <Link
              href="#apply"
              className="px-8 py-3 bg-terracotta text-ivory rounded-xl font-medium hover:brightness-110 transition-all shadow-sm text-center"
            >
              Apply for this role
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-8">
            <section className="prose prose-stone max-w-none">
              <h2 className="text-3xl serif text-near-black mb-6">About the Role</h2>
              <div 
                className="text-olive-gray leading-relaxed space-y-4 font-sans text-lg"
                dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }} 
              />
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-ivory p-6 rounded-2xl ring-shadow border border-border-cream">
              <h3 className="text-xl serif text-near-black mb-4">The Forg Process</h3>
              <ol className="space-y-4 text-sm text-olive-gray">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warm-sand text-near-black flex items-center justify-center font-bold">1</span>
                  <span>Review of your application and proof of build.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warm-sand text-near-black flex items-center justify-center font-bold">2</span>
                  <span>Casual sync to discuss your craft and our mission.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warm-sand text-near-black flex items-center justify-center font-bold">3</span>
                  <span>Collaborative build session (paid).</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warm-sand text-near-black flex items-center justify-center font-bold">4</span>
                  <span>The Offer.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <section id="apply" className="mt-24 pt-24 border-t border-border-cream">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl serif text-near-black mb-4 text-center">Apply for this position</h2>
            <p className="text-olive-gray text-center mb-12">
              Tell us about your craft. We value proof of work over long resumes.
            </p>
            
            <ApplicationForm job={JSON.parse(JSON.stringify(job))} />
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-12 border-t border-border-cream text-center">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="mx-auto mb-4 opacity-50" />
        <p className="text-stone-gray text-sm italic">Built in public at Forg.</p>
      </footer>
    </main>
  );
}
