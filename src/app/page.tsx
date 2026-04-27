import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";
import { EmptyStateIcon } from "@/components/EmptyStateIcon";

export default async function CareersPage() {
  await dbConnect();
  const dbJobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
  const uniqueDepartments = Array.from(new Set(dbJobs.map((j) => j.department))).filter(Boolean) as string[];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Forg",
    url: "https://forg.to",
    logo: "https://careers.forg.to/logo.png",
    sameAs: [
      "https://x.com/forg_to",
      "https://help.forg.to"
    ],
    description: "The community for indie hackers and builders who build in public."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <div className="min-h-screen bg-bg-primary font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Decorative blurred background orb (Top Right) */}
      <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-plus-lighter" />

      {/* Navigation */}
      <nav className="flex items-center justify-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-medium text-lg text-text-primary cursor-pointer">
          <Image src="/logo.png" alt="Forg Logo" width={32} height={32} className="hover:rotate-12 transition-transform duration-500" />
          Forg
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-border-default text-sm font-medium mb-8 text-text-tertiary">
            We're hiring!
          </div>
          
          <h1 className="text-[64px] font-medium serif text-text-primary mb-6 tracking-tight leading-[1.1]">
            Join us in building biggest devs community
          </h1>
          
          <p className="text-lg md:text-[1.25rem] text-text-secondary leading-[1.6] max-w-xl mb-12">
            We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {uniqueDepartments.map((dept) => (
              <button key={dept} className="px-5 py-2 rounded-full border border-border-default hover:border-accent-primary/50 bg-transparent hover:bg-bg-secondary transition-colors text-text-primary text-sm font-medium">
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="w-full h-px bg-border-default my-4"></div>
        
        {dbJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 md:p-24 bg-bg-secondary rounded-2xl ring-shadow mx-auto w-full text-center my-8 border border-border-subtle">
            <EmptyStateIcon />
            <h3 className="text-3xl serif text-text-primary mb-3">No open roles yet.</h3>
            <p className="text-sm md:text-lg text-text-tertiary">We don't have any matching positions right now, but we are always looking for smart builders to join us.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {dbJobs.map((job) => (
              <div key={job._id.toString()} className="group border-b border-border-default py-10 last:border-0 hover:bg-bg-secondary/50 transition-colors px-2 -mx-2 rounded-xl flex items-start justify-between relative cursor-pointer">
                <div className="max-w-2xl">
                  <h3 className="text-[1.75rem] font-medium text-text-primary mb-3 group-hover:text-accent-primary transition-colors serif">
                    {job.title}
                  </h3>
                  <div className="text-text-tertiary mb-6 text-lg prose prose-stone dark:prose-invert max-w-none line-clamp-2" dangerouslySetInnerHTML={{ __html: job.description }} />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-default text-sm font-medium text-text-primary bg-bg-primary/50">
                      <MapPin size={16} className="text-text-tertiary" />
                      {job.location || '100% remote'}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-default text-sm font-medium text-text-primary bg-bg-primary/50">
                      <Clock size={16} className="text-text-tertiary" />
                      {job.type || 'Full-time'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xl font-medium text-text-primary group-hover:text-accent-primary transition-colors relative z-10 pt-2 p-2">
                  Apply <ArrowUpRight size={24} strokeWidth={2} />
                </div>
                <Link href={`/jobs/${job._id}`} className="absolute inset-0 z-0">
                  <span className="sr-only">Apply to {job.title}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Values Banner */}
      <section className="bg-bg-secondary relative py-24 text-center mt-20 px-6 overflow-hidden border-y border-border-subtle">
        {/* Left decorative blur */}
        <div className="absolute bottom-0 left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-accent-secondary/10 blur-[100px] rounded-full pointer-events-none mix-blend-plus-lighter" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] text-text-primary tracking-tight leading-[1.1] mb-12 max-w-[900px] mx-auto font-medium serif">
             "We aren't just building another platform; we're crafting a sanctuary for builders to share their craft, find their voice, and grow their legacy in public."
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="font-medium text-text-primary mb-1 text-2xl serif">Kumar Kislay</div>
            <div className="text-text-tertiary">Founder of forg.to</div>
          </div>
        </div>
      </section>

      {/* Ticker Banner */}
      <div className="bg-text-primary text-bg-primary py-4 text-sm whitespace-nowrap overflow-hidden flex items-center">
        {/* Simple CSS Marquee simulation */}
        <div className="flex min-w-full animate-[marquee_20s_linear_infinite]">
          {[...Array(5)].map((_, i) => (
             <span key={i} className="flex items-center">
                <Link href="https://forg.to" className="mx-4 hover:opacity-70 transition-opacity">Join the community</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-bg-tertiary" />
                <Link href="https://help.forg.to/getting-started/what-is-forg" className="mx-4 hover:opacity-70 transition-opacity">How it works</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-bg-tertiary" />
                <Link href="https://help.forg.to" className="mx-4 hover:opacity-70 transition-opacity">Documentation</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-bg-tertiary" />
                <Link href="https://forg.to/explore" className="mx-4 hover:opacity-70 transition-opacity">Explore products</Link>
                <span className="w-1.5 h-1.5 rounded-full bg-bg-tertiary" />
             </span>
          ))}
        </div>
      </div>

      {/* Light Footer */}
      <footer className="bg-bg-primary pt-12 pb-8 px-6 md:px-12 border-t border-border-default relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-4">
          <Link href="https://forg.to" className="flex items-center gap-3 font-medium text-lg text-text-primary cursor-pointer mb-4 md:mb-0 hover:text-accent-primary transition-colors">
            <Image src="/logo.png" alt="Forg Logo" width={24} height={24} />
            Forg
          </Link>
          <div className="text-text-tertiary text-sm">
            © {new Date().getFullYear()} Forg. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Adding a simple utility inline for the marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-\\[marquee_20s_linear_infinite\\] {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
    </>
  );
}
