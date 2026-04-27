"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import 'react-quill-new/dist/quill.snow.css';
import { X } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const SKILLS_DB: Record<string, string[]> = {
  "Design": ["Figma", "Framer", "Prototyping", "User Research", "Wireframing", "Web Design", "Mobile UI", "Typography", "Illustrator"],
  "Frontend": ["React.js", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "CSS Animations", "Framer Motion", "Svelte", "Redux"],
  "Backend": ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Go", "Python", "GraphQL", "Caching", "Docker", "AWS"],
  "AI/ML": ["Python", "PyTorch", "TensorFlow", "LLMs", "LangChain", "RAG", "Prompt Engineering", "OpenAI API", "Hugging Face"],
  "Mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI", "App Store SEO", "iOS", "Android"],
  "Marketing": ["SEO", "Content Marketing", "Cold Outreach", "Google Ads", "Copywriting", "Launch Strategy", "Email Marketing", "Growth Hacking"],
};

const ALL_SUGGESTED_SKILLS = Array.from(new Set(Object.values(SKILLS_DB).flat())).sort();

interface Question {
  label: string;
  type: "text" | "textarea" | "url" | "email" | "select";
  required: boolean;
  options?: string[];
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
  const [status, setStatus] = useState(initialData?.status || "open");
  const [jobType, setJobType] = useState(initialData?.type || "Full-time");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    initialData?.mustHaveSkills ? initialData.mustHaveSkills.split(",").map((s: string) => s.trim()) : []
  );
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions || [
      { label: "Portfolio URL", type: "url", required: true },
      { label: "What is the most interesting thing you've built lately?", type: "textarea", required: true },
    ]
  );
  
  const filteredSuggestions = ALL_SUGGESTED_SKILLS.filter(
    skill => skill.toLowerCase().includes(skillInput.toLowerCase()) && !selectedSkills.includes(skill)
  ).slice(0, 10);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setSkillInput("");
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

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
    const experience = formData.get("experience");
    const salaryRange = formData.get("salaryRange");
    const budget = formData.get("budget");

    // Validation
    if (!title || !department || !location || selectedSkills.length === 0 || !experience) {
      setError("Please fill in all basic job details, including at least one skill.");
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
      type: jobType,
      description: description,
      status,
      requestForgUsername,
      forgUsernameRequired,
      questions,
      mustHaveSkills: selectedSkills.join(", "),
      experience,
      salaryRange,
      budget,
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

      <div className="bg-bg-secondary p-8 rounded-xl ring-shadow space-y-6 border border-border-subtle relative">
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h2 className="text-2xl serif text-text-primary">Job Details</h2>
          <div className="flex items-center gap-3 bg-bg-primary/50 px-4 py-2 rounded-xl border border-border-subtle">
            <span className="text-sm font-medium text-text-secondary">Status:</span>
            <button
              type="button"
              onClick={() => setStatus(status === "open" ? "closed" : "open")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                status === "open" ? "bg-terracotta" : "bg-stone-gray/30"
              }`}
            >
              <span
                className={`${
                  status === "open" ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <span className="text-sm font-bold text-text-primary capitalize">{status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Job Title</label>
            <input
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Department</label>
            <select
              name="department"
              defaultValue={initialData?.department || "Engineering"}
              required
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
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
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Job Type</label>
            <select
              name="type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Must-have Skills</label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 min-h-[44px] p-2 border border-border-default rounded-xl bg-bg-elevated focus-within:ring-2 focus-within:ring-accent-primary transition-all">
                {selectedSkills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-accent-primary text-text-inverse rounded-full text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:opacity-70">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <div className="relative flex-1 min-w-[120px]">
                  <input
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowSkillSuggestions(true);
                    }}
                    onFocus={() => setShowSkillSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (skillInput) addSkill(skillInput);
                      }
                    }}
                    placeholder={selectedSkills.length === 0 ? "e.g. React, TypeScript..." : "Add more..."}
                    className="w-full bg-transparent border-none focus:ring-0 text-text-primary p-1 text-sm outline-none"
                  />
                  {showSkillSuggestions && skillInput && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-bg-elevated border border-border-default rounded-xl shadow-xl max-h-48 overflow-auto">
                      {filteredSuggestions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                      {skillInput && !ALL_SUGGESTED_SKILLS.some(s => s.toLowerCase() === skillInput.toLowerCase()) && (
                        <button
                          type="button"
                          onClick={() => addSkill(skillInput)}
                          className="w-full px-4 py-2 text-left text-sm text-accent-primary font-medium hover:bg-bg-tertiary transition-colors border-t border-border-subtle"
                        >
                          Add custom: "{skillInput}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Quick Add:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(SKILLS_DB).map(([category, skills]) => (
                    <div key={category} className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map(skill => (
                        !selectedSkills.includes(skill) && (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="px-3 py-1 text-xs border border-border-default rounded-full text-text-secondary hover:border-accent-primary/50 hover:text-text-primary transition-all bg-bg-primary/30"
                          >
                            + {skill}
                          </button>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Work Experience</label>
            <input
              name="experience"
              defaultValue={initialData?.experience}
              required
              placeholder="e.g. 3+ years"
              className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
            />
          </div>
          
          {(jobType === "Part-time" || jobType === "Internship") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Monthly Salary / Stipend</label>
              <input
                name="salaryRange"
                defaultValue={initialData?.salaryRange}
                placeholder="e.g. $2000 - $3000"
                className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
              />
            </div>
          )}

          {jobType === "Contract" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Budget</label>
              <input
                name="budget"
                defaultValue={initialData?.budget}
                placeholder="e.g. $5000 fixed price"
                className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
              />
            </div>
          )}
          
          {jobType === "Full-time" && (
             <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Salary Range (Optional)</label>
              <input
                name="salaryRange"
                defaultValue={initialData?.salaryRange}
                placeholder="e.g. $80k - $120k"
                className="w-full px-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-elevated transition-all text-text-primary"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-4 bg-bg-primary/50 rounded-xl border border-border-default">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-text-primary">Request Forg Username</h4>
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
                <h4 className="text-sm font-bold text-text-primary">Make Required</h4>
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
          <div className="bg-bg-elevated rounded-xl overflow-hidden border border-border-default min-h-[300px]">
            <ReactQuill 
              theme="snow" 
              value={description} 
              onChange={setDescription}
              modules={modules}
              className="h-[250px] mb-12 text-text-primary"
            />
          </div>
        </div>
      </div>

      <div className="bg-bg-secondary p-8 rounded-xl ring-shadow space-y-6 border border-border-subtle">
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h2 className="text-2xl serif text-text-primary">Application Questions</h2>
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
            <div key={index} className="flex flex-col gap-4 bg-bg-elevated p-6 rounded-xl border border-border-default shadow-sm hover:border-accent-primary/30 transition-all">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Question Label</label>
                  <textarea
                    placeholder="e.g. Tell us about your most complex project..."
                    value={q.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-border-default rounded-xl focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-primary transition-all text-text-primary text-lg resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-8 p-2 text-text-tertiary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
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
                      { id: "select", label: "Select" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          updateQuestion(index, "type", type.id as any);
                          if (type.id === "select" && !q.options) {
                            updateQuestion(index, "options", [""]);
                          }
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          q.type === type.id
                            ? "bg-bg-elevated text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-bg-tertiary px-4 py-3 rounded-xl cursor-pointer hover:brightness-95 transition-all self-end" onClick={() => updateQuestion(index, "required", !q.required)}>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                    id={`req-${index}`}
                    className="w-4 h-4 rounded border-border-default text-accent-primary focus:ring-accent-primary cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`req-${index}`} className="text-sm font-medium text-text-primary cursor-pointer select-none">Required Question</label>
                </div>
              </div>

              {q.type === "select" && (
                <div className="space-y-3 bg-bg-primary/50 p-4 rounded-xl border border-border-subtle animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Options</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = [...(q.options || []), ""];
                        updateQuestion(index, "options", newOptions);
                      }}
                      className="text-xs font-bold text-accent-primary hover:brightness-110 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(q.options || []).map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(q.options || [])];
                            newOptions[optIndex] = e.target.value;
                            updateQuestion(index, "options", newOptions);
                          }}
                          className="flex-1 px-3 py-2 border border-border-default rounded-lg focus:ring-2 focus:ring-accent-primary focus:outline-none bg-bg-primary transition-all text-text-primary text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = (q.options || []).filter((_, i) => i !== optIndex);
                            updateQuestion(index, "options", newOptions.length > 0 ? newOptions : [""]);
                          }}
                          className="p-2 text-text-tertiary hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 bg-bg-primary/30 rounded-xl border border-dashed border-border-default">
              <p className="text-text-tertiary italic">No questions added. Every application needs at least one question.</p>
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
          className="px-8 py-3 bg-accent-primary text-text-inverse rounded-xl font-medium hover:brightness-110 transition-all shadow-sm"
        >
          {isEdit ? "Update Role" : "Post Role"}
        </button>
      </div>
    </form>
  );
}
