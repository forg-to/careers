import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Clock } from "lucide-react";
import ApplicationForm from "@/components/ApplicationForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await dbConnect();
  const { id } = await params;
  const job = await Job.findById(id);

  if (!job) return { title: "Job Not Found" };

  const description = job.description.replace(/<[^>]*>/g, "").slice(0, 160) + "...";

  return {
    title: job.title,
    description: description,
    openGraph: {
      title: `${job.title} | Forg Careers`,
      description: description,
      url: `https://careers.forg.to/jobs/${id}`,
    },
  };
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await dbConnect();
  const { id } = await params;
  const job = await Job.findById(id);

  if (!job || job.status === "closed") {
    notFound();
  }

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    validThrough: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    employmentType: job.type === "Full-time" ? "FULL_TIME" : "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: "Forg",
      sameAs: "https://forg.to",
      logo: "https://careers.forg.to/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "Remote",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <main className="min-h-screen bg-parchment py-12 px-4 md:px-6 w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 text-olive-gray hover:text-near-black mb-8 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to all roles
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-default">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl serif text-text-primary mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-4 md:gap-6 text-text-tertiary">
                <span className="flex items-center gap-2 font-medium">
                  <Briefcase size={18} className="text-text-tertiary" />
                  {job.department}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <MapPin size={18} className="text-text-tertiary" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Clock size={18} className="text-text-tertiary" />
                  {job.type}
                </span>
              </div>
            </div>
            <Link
              href="#apply"
              className="px-8 py-3 bg-accent-primary text-text-inverse rounded-xl font-medium hover:brightness-110 transition-all shadow-sm text-center"
            >
              Apply for this role
            </Link>
          </div>
        </header>

        <div className="space-y-12 max-w-3xl">
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-bg-secondary p-6 md:p-8 rounded-2xl ring-shadow border border-border-subtle">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Experience</h4>
                <p className="text-lg font-medium text-text-primary">{job.experience}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
                  {job.type === "Contract" ? "Budget" : "Salary"}
                </h4>
                <p className="text-lg font-medium text-text-primary">
                  {job.type === "Contract" ? job.budget : job.salaryRange || "Competitive"}
                </p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest">Must-have Skills</h4>
                <p className="text-lg font-medium text-text-primary">{job.mustHaveSkills}</p>
              </div>
            </section>

            <section className="prose prose-stone max-w-none">
              <h2 className="text-3xl serif text-text-primary mb-6">About the Role</h2>
              <div 
                className="text-text-secondary leading-relaxed font-sans text-lg rich-text"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </section>
        </div>

        <section id="apply" className="mt-24 pt-24 border-t border-border-default">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl serif text-text-primary mb-4 text-center">Apply for this position</h2>
            <p className="text-text-tertiary text-center mb-12">
              Tell us about your craft. We value proof of work over long resumes.
            </p>
            
            <ApplicationForm job={JSON.parse(JSON.stringify(job))} />
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-12 border-t border-border-default text-center">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="mx-auto mb-4 opacity-50" />
        <p className="text-text-tertiary text-sm italic">Built in public at Forg.</p>
      </footer>
    </main>
    </>
  );
}
