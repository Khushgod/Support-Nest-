import LoginForm from "./LoginForm";

export const metadata = {
  title: "Welcome back to SupportNest",
  description:
    "Log in to your SupportNest account to access the community, your saved resources, and tools like GeneTranslate.",
};

export default function LoginPage() {
  return (
    <div className="bg-white rounded-3xl shadow-[var(--shadow-primary-panel)] border border-cream-200 p-7 sm:p-9 animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-slate-600">
        Glad you&rsquo;re here. Pick up right where you left off.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
