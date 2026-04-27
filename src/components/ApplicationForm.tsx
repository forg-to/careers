"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Search, User, Loader2, XCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ForgUser {
  username: string;
  name: string;
  avatar?: string;
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function ValidatedEmailInput({ 
  name, 
  placeholder, 
  required, 
  onChange 
}: { 
  name: string; 
  placeholder: string; 
  required?: boolean; 
  onChange?: (val: string, isValid: boolean) => void 
}) {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsValid(null);
      return;
    }

    const timer = setTimeout(() => {
      const valid = !!validateEmail(value);
      setIsValid(valid);
      onChange?.(value, valid);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="space-y-2 relative">
      <div className="relative">
        <input
          name={name}
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none bg-white transition-all font-sans text-near-black pr-10 ${
            isValid === true ? "border-green-500 focus:ring-green-200" : 
            isValid === false ? "border-red-500 focus:ring-red-200" : 
            "border-border-cream focus:ring-terracotta"
          }`}
          placeholder={placeholder}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValid === true && <CheckCircle2 size={18} className="text-green-500" />}
          {isValid === false && <XCircle size={18} className="text-red-500" />}
        </div>
      </div>
      {isValid === false && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> Please enter a valid email address
        </p>
      )}
    </div>
  );
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
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!emailIsValid) {
      setError("Please provide a valid email address.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const answers = job.questions.map((q: any) => ({
      question: q.label,
      answer: formData.get(q.label),
    }));

    // Additional check for email type questions
    const emailQuestions = job.questions.filter((q: any) => q.type === 'email' && q.required);
    for (const q of emailQuestions) {
      const val = formData.get(q.label) as string;
      if (!validateEmail(val)) {
        setError(`Please provide a valid email for: ${q.label}`);
        setLoading(false);
        return;
      }
    }

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
      window.scrollTo({ top: (document.getElementById('apply')?.offsetTop || 0), behavior: 'smooth' });
    } else {
      const errData = await res.json();
      setError(errData.error || "Failed to submit application.");
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      
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
          <label className="block text-sm font-medium text-charcoal-warm">Email Address <span className="text-terracotta">*</span></label>
          <ValidatedEmailInput 
            name="email" 
            placeholder="john@example.com" 
            required 
            onChange={(_, isValid) => setEmailIsValid(isValid)}
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
            ) : q.type === "select" ? (
              <select
                name={q.label}
                required={q.required}
                className="w-full px-4 py-3 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans text-near-black"
              >
                <option value="">Select an option...</option>
                {q.options?.map((opt: string, i: number) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : q.type === "email" ? (
              <ValidatedEmailInput 
                name={q.label} 
                placeholder="Email address..." 
                required={q.required} 
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
