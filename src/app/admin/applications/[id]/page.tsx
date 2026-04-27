import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Briefcase, ExternalLink } from "lucide-react";
import Image from "next/image";

async function ForgProfilePreview({ username }: { username: string }) {
  try {
    const res = await fetch(`https://api.forg.to/v1/users/${username}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const user = data.user;

    return (
      <div className="bg-bg-secondary p-6 rounded-xl ring-shadow space-y-4 border border-border-subtle mt-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg serif text-text-primary border-b border-border-default pb-2 flex-1">Forg Profile</h3>
          <Link 
            href={`https://forg.to/${username}`} 
            target="_blank" 
            className="text-accent-primary hover:brightness-110 flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
          >
            Visit <ExternalLink size={14} />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-bg-tertiary flex-shrink-0 relative border-2 border-border-default">
            {user.avatar ? (
              <Image src={user.avatar} alt={username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                <User size={32} />
              </div>
            )}
          </div>
          <div>
            <div className="text-xl font-bold text-text-primary">{user.name}</div>
            <div className="text-sm text-text-tertiary">@{user.username}</div>
            {user.bio && <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{user.bio}</p>}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="bg-bg-secondary p-6 rounded-xl ring-shadow mt-6 text-sm text-text-tertiary italic border border-border-subtle">
        Could not load Forg profile for @{username}
      </div>
    );
  }
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
          className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-4 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Applications
        </Link>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-secondary border border-border-subtle">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl serif text-text-primary">{application.name}</h1>
            <p className="text-text-tertiary italic">Application details</p>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-bg-secondary p-6 rounded-xl ring-shadow space-y-4 border border-border-subtle">
            <h3 className="text-lg serif text-text-primary border-b border-border-default pb-2">Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail size={16} className="text-text-tertiary" />
                {application.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Briefcase size={16} className="text-text-tertiary" />
                {(application.jobId as any)?.title || 'Unknown Role'}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar size={16} className="text-text-tertiary" />
                {new Date(application.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {application.forgUsername && (
            <ForgProfilePreview username={application.forgUsername} />
          )}
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-bg-secondary p-8 rounded-xl ring-shadow border border-border-subtle space-y-8">
            <h2 className="text-2xl serif text-text-primary border-b border-border-default pb-4">Responses</h2>
            {application.answers.map((ans: any, idx: number) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">{ans.question}</h4>
                <div className="p-4 bg-bg-primary rounded-lg text-text-secondary leading-relaxed whitespace-pre-wrap font-sans border border-border-subtle">
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
