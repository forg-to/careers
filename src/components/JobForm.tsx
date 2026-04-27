"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [
      { label: "Portfolio URL", type: "url", required: true },
      { label: "What is the most interesting thing you've built lately?", type: "textarea", required: true },
    ]
  );

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
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      department: formData.get("department"),
      location: formData.get("location"),
      type: formData.get("type"),
      description: formData.get("description"),
      status: formData.get("status"),
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="bg-ivory p-8 rounded-xl ring-shadow space-y-6">
        <h2 className="text-2xl serif text-near-black border-b border-border-cream pb-4">Job Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">Job Title</label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">Department</label>
            <input
              name="department"
              defaultValue={initialData?.department}
              required
              placeholder="e.g. Engineering"
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">Location</label>
            <input
              name="location"
              defaultValue={initialData?.location}
              required
              placeholder="e.g. Remote (UTC-5 to UTC+5)"
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">Job Type</label>
            <select
              name="type"
              defaultValue={initialData?.type || "Full-time"}
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal-warm">Status</label>
            <select
              name="status"
              defaultValue={initialData?.status || "open"}
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal-warm">Job Description</label>
          <textarea
            name="description"
            defaultValue={initialData?.description}
            required
            rows={10}
            className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all font-sans"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>
      </div>

      <div className="bg-ivory p-8 rounded-xl ring-shadow space-y-6">
        <div className="flex justify-between items-center border-b border-border-cream pb-4">
          <h2 className="text-2xl serif text-near-black">Application Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 text-sm px-4 py-1.5 bg-warm-sand text-charcoal-warm rounded-lg hover:brightness-95 transition-all font-medium"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-border-cream">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1.5">
                  <input
                    placeholder="Question Label"
                    value={q.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    className="w-full px-3 py-1.5 border border-border-cream rounded-lg focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, "type", e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-border-cream rounded-lg focus:outline-none text-sm"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Answer</option>
                    <option value="url">URL</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                    id={`req-${index}`}
                  />
                  <label htmlFor={`req-${index}`} className="text-xs text-olive-gray">Required</label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="p-1.5 text-stone-gray hover:text-red-500 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Link
          href="/admin"
          className="px-8 py-3 bg-warm-sand text-charcoal-warm rounded-xl font-medium hover:brightness-95 transition-all"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-8 py-3 bg-terracotta text-ivory rounded-xl font-medium hover:brightness-110 transition-all shadow-sm"
        >
          {isEdit ? "Update Role" : "Post Role"}
        </button>
      </div>
    </form>
  );
}
