"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Search, User, Loader2 } from "lucide-react";
import Image from "next/image";

interface ForgUser {
  username: string;
  name: string;
  avatar?: string;
}

function ForgUsernameSearch({ 
  required, 
  value, 
  onChange 
}: { 
  required: boolean; 
  value: string; 
  onChange: (val: string) => void 
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<ForgUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`https://api.forg.to/v1/users?search=${query}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.users || []);
            setShowResults(true);
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-charcoal-warm">
        Forg Username {required && <span className="text-terracotta">*</span>}
      </label>
      <div className="relative">
        <input
          name="forgUsername"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          required={required}
          autoComplete="off"
          className="w-full pl-10 pr-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
          placeholder="Type your forg.to username..."
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-gray">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border-cream rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((user) => (
            <button
              key={user.username}
              type="button"
              onClick={() => {
                setQuery(user.username);
                onChange(user.username);
                setShowResults(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-parchment transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-warm-sand flex-shrink-0 relative">
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.username} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-gray">
                    <User size={16} />
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-near-black">{user.name}</div>
                <div className="text-xs text-olive-gray">@{user.username}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicationForm({ job }: { job: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgUsername, setForgUsername] = useState("");

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
      forgUsername: job.requestForgUsername ? forgUsername : undefined,
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
            className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans text-near-black"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal-warm">Email Address</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans text-near-black"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {job.requestForgUsername && (
        <ForgUsernameSearch 
          required={job.forgUsernameRequired} 
          value={forgUsername}
          onChange={setForgUsername}
        />
      )}

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
                className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans text-near-black"
                placeholder="Share your thoughts..."
              />
            ) : (
              <input
                name={q.label}
                type={q.type}
                required={q.required}
                className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans text-near-black"
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
