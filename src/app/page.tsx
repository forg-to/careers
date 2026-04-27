import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";

// Mock jobs to match the exact screenshot if database is empty
const MOCK_JOBS = [
  {
    _id: "1",
    title: "Product Designer",
    description: "We're looking for a mid-level product designer to join our team.",
    location: "100% remote",
    type: "Full-time",
  },
  {
    _id: "2",
    title: "Engineering Manager",
    description: "We're looking for an experienced engineering manager to join our team.",
    location: "100% remote",
    type: "Full-time",
  },
  {
    _id: "3",
    title: "Customer Success Manager",
    description: "We're looking for a customer success manager to join our team.",
    location: "100% remote",
    type: "Full-time",
  },
  {
    _id: "4",
    title: "Account Executive",
    description: "We're looking for an account executive to join our team.",
    location: "100% remote",
    type: "Full-time",
  },
  {
    _id: "5",
    title: "SEO Marketing Manager",
    description: "We're looking for an experienced SEO marketing manager to join our team.",
    location: "100% remote",
    type: "Full-time",
  },
];

export default async function CareersPage() {
  await dbConnect();
  const dbJobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
  const displayJobs = dbJobs.length > 0 ? dbJobs : MOCK_JOBS;

  return (
    <div className="min-h-screen bg-parchment font-sans relative overflow-x-hidden">
      {/* Decorative blurred background orb (Top Right) */}
      <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#d97757]/30 blur-[100px] rounded-full pointer-events-none -z-10 mix-blend-multiply" />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-medium text-lg text-near-black cursor-pointer">
          <svg className="w-6 h-6 text-terracotta" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
          Untitled UI
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-near-black">
          <Link href="#" className="hover:text-terracotta transition-colors">Home</Link>
          <Link href="#" className="hover:text-terracotta transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-terracotta transition-colors">How it works</Link>
          <Link href="#" className="hover:text-terracotta transition-colors">Resources <span className="text-stone-gray ml-0.5">+</span></Link>
          <Link href="#" className="hover:text-terracotta transition-colors">Company <span className="text-stone-gray ml-0.5">+</span></Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/admin/login" className="hidden sm:block text-near-black hover:text-terracotta transition-colors">Log in</Link>
          <Link href="#" className="bg-near-black text-white px-5 py-2.5 rounded-full hover:bg-near-black/90 transition-colors">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 pt-16 pb-12 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <div className="inline-block px-4 py-1.5 rounded-full border border-stone-gray/30 text-sm font-medium mb-8">
            We're hiring!
          </div>
          
          <h1 className="text-6xl md:text-[5rem] serif text-near-black mb-6 tracking-tight leading-[1.05]">
            Be part of our mission
          </h1>
          
          <p className="text-lg md:text-[1.25rem] text-olive-gray leading-[1.6] max-w-xl mb-12">
            We're looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <button className="px-5 py-2 rounded-full border border-near-black bg-near-black text-ivory text-sm font-medium">
              View all
            </button>
            {['Development', 'Design', 'Marketing', 'Customer Service', 'Operations', 'Finance', 'Management'].map((dept) => (
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
        
        <div className="flex flex-col">
          {displayJobs.map((job) => (
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
      <footer className="bg-ivory pt-16 pb-8 px-6 md:px-12 border-t border-border-cream/0 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between">
          
          <div className="flex flex-wrap md:flex-nowrap justify-between w-full gap-8 lg:gap-16">
            <div className="w-full grid grid-cols-2 lg:grid-cols-6 gap-8 text-sm">
              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Product</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Overview</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Features</Link>
                <Link href="#" className="font-medium text-near-black flex items-center gap-2 hover:text-terracotta">
                  Solutions <span className="text-[10px] uppercase font-bold border border-stone-gray/30 px-2 py-0.5 rounded-full text-olive-gray">New</span>
                </Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Tutorials</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Pricing</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Releases</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Company</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">About us</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Careers</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Press</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">News</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Media kit</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Contact</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Resources</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Blog</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Newsletter</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Events</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Help centre</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Tutorials</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Support</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Use cases</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Startups</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Enterprise</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Government</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">SaaS</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Marketplaces</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Ecommerce</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Social</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Twitter</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">LinkedIn</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Facebook</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">GitHub</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">AngelList</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Dribbble</Link>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="font-medium text-stone-gray mb-1">Legal</h4>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Terms</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Privacy</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Cookies</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Licenses</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Settings</Link>
                <Link href="#" className="font-medium text-near-black hover:text-terracotta">Contact</Link>
              </div>
            </div>
            
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-stone-gray/20">
          <div className="flex items-center gap-2 font-medium text-lg text-near-black cursor-pointer mb-4 md:mb-0">
            <svg className="w-6 h-6 text-terracotta" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
            Untitled UI
          </div>
          <div className="text-stone-gray text-sm">
            © 2077 Untitled UI. All rights reserved.
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
