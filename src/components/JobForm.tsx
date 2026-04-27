"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Question {
  label: string;
  type: "text" | "textarea" | "url" | "email";
  required: boolean;
}

interface JobFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function JobForm({ initialData, isEdit }: JobFormProps) {
  const router = useRouter();
  const [description, setDescription] = useState(initialData?.description || "");
  const [requestForgUsername, setRequestForgUsername] = useState(initialData?.requestForgUsername ?? true);
  const [forgUsernameRequired, setForgUsernameRequired] = useState(initialData?.forgUsernameRequired ?? true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [
      { label: "Portfolio URL", type: "url", required: true },
      { label: "What is the most interesting thing you've built lately?", type: "textarea", required: true },
    ]
  );

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  }), []);

  const addQuestion = () => {
    setQuestions([...questions, { label: "", type: "text", required: true }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const department = formData.get("department");
    const location = formData.get("location");
    const status = formData.get("status");

    // Validation
    if (!title || !department || !location) {
      setError("Please fill in all basic job details.");
      return;
    }

    if (!description || description === "<p><br></p>") {
      setError("Job description cannot be empty.");
      return;
    }

    if (questions.length === 0) {
      setError("At least one application question is required.");
      return;
    }

    if (questions.some(q => !q.label.trim())) {
      setError("All questions must have a label.");
      return;
    }

    const data = {
      title,
      department,
      location,
      type: formData.get("type"),
      description: description,
      status,
      requestForgUsername,
      forgUsernameRequired,
      questions,
    };

    const url = isEdit ? `/api/jobs/${initialData._id}` : "/api/jobs";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const errData = await res.json();
      setError(errData.error || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="bg-ivory p-8 rounded-xl ring-shadow space-y-6 border border-border-subtle">
        <h2 className="text-2xl serif text-near-black border-b border-border-subtle pb-4">Job Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Job Title</label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Department</label>
            <select
              name="department"
              defaultValue={initialData?.department || "Engineering"}
              required
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black"
            >
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Location</label>
            <input
              name="location"
              defaultValue={initialData?.location}
              required
              placeholder="e.g. Remote (UTC-5 to UTC+5)"
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Job Type</label>
            <select
              name="type"
              defaultValue={initialData?.type || "Full-time"}
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "open"}
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-border-default">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-near-black">Request Forg Username</h4>
              <p className="text-xs text-text-secondary">Ask the applicant for their forg.to profile username.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={requestForgUsername}
                onChange={(e) => setRequestForgUsername(e.target.checked)}
              />
              <div className="w-11 h-6 bg-stone-gray/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta"></div>
            </label>
          </div>
          
          {requestForgUsername && (
            <div className="flex items-center justify-between border-t border-border-subtle pt-4">
              <div>
                <h4 className="text-sm font-bold text-near-black">Make Required</h4>
                <p className="text-xs text-text-secondary">If disabled, the field will be optional.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={forgUsernameRequired}
                  onChange={(e) => setForgUsernameRequired(e.target.checked)}
                />
                <div className="w-11 h-6 bg-stone-gray/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta"></div>
              </label>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary mb-2">Job Description</label>
          <div className="bg-white rounded-xl overflow-hidden border border-border-default min-h-[300px]">
            <ReactQuill 
              theme="snow" 
              value={description} 
              onChange={setDescription}
              modules={modules}
              className="h-[250px] mb-12 text-near-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-ivory p-8 rounded-xl ring-shadow space-y-6 border border-border-subtle">
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h2 className="text-2xl serif text-near-black">Application Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 text-sm px-4 py-1.5 bg-bg-tertiary text-text-primary rounded-lg hover:brightness-95 transition-all font-medium"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-border-default shadow-sm hover:border-accent-primary/30 transition-all">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Question Label</label>
                  <input
                    placeholder="e.g. Tell us about your most complex project..."
                    value={q.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    className="w-full px-4 py-3 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-white transition-all text-near-black text-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-8 p-2 text-text-tertiary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove Question"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Answer Type</label>
                  <div className="flex bg-bg-tertiary p-1 rounded-xl gap-1">
                    {[
                      { id: "text", label: "Short Text" },
                      { id: "textarea", label: "Long Answer" },
                      { id: "url", label: "URL" },
                      { id: "email", label: "Email" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => updateQuestion(index, "type", type.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          q.type === type.id
                            ? "bg-white text-near-black shadow-sm"
                            : "text-text-secondary hover:text-near-black"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-bg-tertiary px-4 py-3 rounded-xl cursor-pointer hover:bg-stone-gray/10 transition-all self-end" onClick={() => updateQuestion(index, "required", !q.required)}>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                    id={`req-${index}`}
                    className="w-4 h-4 rounded border-border-default text-accent-primary focus:ring-accent-primary cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`req-${index}`} className="text-sm font-medium text-near-black cursor-pointer select-none">Required Question</label>
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-border-default">
              <p className="text-olive-gray italic">No questions added. Every application needs at least one question.</p>
              <button
                type="button"
                onClick={addQuestion}
                className="mt-4 text-accent-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                <Plus size={16} /> Add your first question
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link
          href="/admin"
          className="px-8 py-3 bg-bg-tertiary text-text-primary rounded-xl font-medium hover:brightness-95 transition-all"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-8 py-3 bg-accent-primary text-ivory rounded-xl font-medium hover:brightness-110 transition-all shadow-sm"
        >
          {isEdit ? "Update Role" : "Post Role"}
        </button>
      </div>
    </form>
  );
}
