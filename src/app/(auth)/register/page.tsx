import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Join SupportNest",
  description:
    "Create a free SupportNest account to join the community, save resources, and use our tools.",
};

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_30px_60px_-30px_rgba(208,74,44,0.25)] border border-cream-200 p-7 sm:p-9 animate-slide-up">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
        Make a cozy place for yourself
      </h1>
      <p className="mt-1.5 text-sm text-slate-600">
        Join free. We&rsquo;re kind, ad-free, and never sell your data.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
