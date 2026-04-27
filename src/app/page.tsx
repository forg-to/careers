import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";

export default async function CareersPage() {
  await dbConnect();
  const dbJobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
  const uniqueDepartments = Array.from(new Set(dbJobs.map((j) => j.department))).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-parchment font-sans relative overflow-x-hidden">
      {/* Decorative blurred background orb (Top Right) */}
      <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#d97757]/30 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-multiply" />

      {/* Navigation */}
      <nav className="flex items-center justify-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 font-medium text-lg text-near-black cursor-pointer">
          <Image src="/logo.png" alt="Forg Logo" width={32} height={32} className="hover:rotate-12 transition-transform duration-500" />
          Forg
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-12 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-stone-gray/30 text-sm font-medium mb-8">
            We're hiring!
          </div>
          
          <h1 className="text-6xl md:text-[5rem] serif text-near-black mb-6 tracking-tight leading-[1.05]">
            Join us in building biggest devs community
          </h1>
          
          <p className="text-lg md:text-[1.25rem] text-olive-gray leading-[1.6] max-w-xl mb-12">
            We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button className="px-5 py-2 rounded-full border border-near-black bg-near-black text-ivory text-sm font-medium">
              View all
            </button>
            {uniqueDepartments.map((dept) => (
              <button key={dept} className="px-5 py-2 rounded-full border border-stone-gray/30 hover:border-border-cream bg-transparent hover:bg-ivory transition-colors text-near-black text-sm font-medium">
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="w-full h-px bg-stone-gray/20 my-4"></div>
        
        {dbJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 md:p-24 bg-ivory rounded-2xl ring-shadow mx-auto w-full text-center my-8">
            <MagnifyingGlass size={64} weight="duotone" className="text-terracotta mb-6 opacity-80" />
            <h3 className="text-3xl serif text-near-black mb-3">No open roles yet.</h3>
            <p className="text-sm md:text-lg text-olive-gray">We don't have any matching positions right now, but we are always looking for smart builders to join us.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {dbJobs.map((job) => (
              <div key={job._id.toString()} className="group border-b border-stone-gray/20 py-10 last:border-0 hover:bg-ivory/50 transition-colors px-2 -mx-2 rounded-xl flex items-start justify-between relative cursor-pointer">
                <div className="max-w-2xl">
                  <h3 className="text-[1.75rem] font-medium text-near-black mb-3 group-hover:text-terracotta transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-olive-gray mb-6 text-lg">
                    {job.description || `We're looking for a ${job.title.toLowerCase()} to join our team.`}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-gray/30 text-sm font-medium text-near-black">
                      <MapPin size={16} className="text-stone-gray" />
                      {job.location || '100% remote'}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-gray/30 text-sm font-medium text-near-black">
                      <Clock size={16} className="text-stone-gray" />
                      {job.type || 'Full-time'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xl font-medium text-near-black group-hover:text-terracotta transition-colors relative z-10 pt-2 p-2">
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
      <section className="bg-ivory relative py-24 text-center mt-20 px-6 overflow-hidden">
        {/* Left decorative blur */}
        <div className="absolute bottom-0 left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#3898ec]/10 blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-[4rem] text-near-black tracking-tight leading-[1.1] mb-12 max-w-[900px] mx-auto font-medium">
             Untitled truly values work-life balance. We work hard and deliver, but at the end of the day you can switch off.
          </h2>
          
          <div className="flex flex-col items-center">
            <Image 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80" 
              alt="Avatar" 
              width={64} 
              height={64} 
              className="rounded-full mb-4 object-cover"
            />
            <div className="font-medium text-near-black mb-1 text-lg">Frankie Sullivan</div>
            <div className="text-olive-gray">Web Developer, Untitled</div>
          </div>
        </div>
      </section>

      {/* Ticker Banner */}
      <div className="bg-near-black text-warm-silver py-4 text-sm whitespace-nowrap overflow-hidden flex items-center">
        {/* Simple CSS Marquee simulation */}
        <div className="flex min-w-full animate-[marquee_20s_linear_infinite]">
          {[...Array(5)].map((_, i) => (
             <span key={i} className="flex items-center">
                <span className="mx-4">Subscribe to our newsletter</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-gray" />
                <span className="mx-4">How it works</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-gray" />
                <span className="mx-4">Documentation</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-gray" />
                <span className="mx-4">Join the community</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-gray" />
             </span>
          ))}
        </div>
      </div>

      {/* Light Footer */}
      <footer className="bg-ivory pt-12 pb-8 px-6 md:px-12 border-t border-border-cream/50 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-4">
          <Link href="https://forg.to" className="flex items-center gap-3 font-medium text-lg text-near-black cursor-pointer mb-4 md:mb-0 hover:text-terracotta transition-colors">
            <Image src="/logo.png" alt="Forg Logo" width={24} height={24} />
            Forg
          </Link>
          <div className="text-stone-gray text-sm">
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
  );
}
