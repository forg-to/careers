import { login } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  async function action(formData: FormData) {
    "use server";
    const success = await login(formData);
    if (success) {
      redirect("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-ivory p-8 rounded-xl ring-shadow whisper-shadow">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Forg Logo" width={60} height={60} className="mb-4" />
          <h1 className="text-3xl serif text-near-black">Admin Login</h1>
          <p className="text-olive-gray font-sans mt-2">Enter your credentials to manage roles.</p>
        </div>

        <form action={action} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-warm mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-warm mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-border-cream rounded-xl focus:ring-2 focus:ring-terracotta focus:outline-none bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-terracotta text-ivory rounded-xl font-medium hover:brightness-110 transition-all shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
