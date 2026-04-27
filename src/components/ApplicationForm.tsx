"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ApplicationForm({ job }: { job: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const answers = job.questions.map((q: any) => ({
      question: q.label,
      answer: formData.get(q.label),
    }));

    const data = {
      jobId: job._id,
      name: formData.get("name"),
      email: formData.get("email"),
      answers,
    };

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
      window.scrollTo({ top: document.getElementById('apply')?.offsetTop, behavior: 'smooth' });
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-ivory p-12 rounded-2xl ring-shadow text-center space-y-4 whisper-shadow border border-border-cream">
        <div className="flex justify-center">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h3 className="text-3xl serif text-near-black">Application Received</h3>
        <p className="text-olive-gray text-lg max-w-md mx-auto">
          Thank you for sharing your journey with us. We'll review your "proof of build" and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-ivory p-8 md:p-12 rounded-2xl ring-shadow border border-border-cream whisper-shadow">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal-warm">Full Name</label>
          <input
            name="name"
            required
            className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal-warm">Email Address</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="space-y-8">
        {job.questions.map((q: any, index: number) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">
              {q.label} {q.required && <span className="text-terracotta">*</span>}
            </label>
            {q.type === "textarea" ? (
              <textarea
                name={q.label}
                required={q.required}
                rows={5}
                className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
                placeholder="Share your thoughts..."
              />
            ) : (
              <input
                name={q.label}
                type={q.type}
                required={q.required}
                className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
                placeholder={q.type === 'url' ? 'https://...' : ''}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-terracotta text-ivory rounded-xl font-medium hover:brightness-110 transition-all shadow-md disabled:opacity-50 text-lg"
      >
        {loading ? "Sending..." : "Submit Application"}
      </button>
      
      <p className="text-center text-xs text-stone-gray italic">
        By submitting, you agree to our builder's code of conduct.
      </p>
    </form>
  );
}
