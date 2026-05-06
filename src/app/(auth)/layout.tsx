import Link from "next/link";
import Logo from "@/components/supportnest/Logo";
import { Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-warm-gradient flex flex-col">
      <header className="px-6 py-5">
        <Logo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-10">
        <div className="w-full max-w-md">
          {children}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>
              Encrypted in transit (TLS) and at rest (AES&#8209;256&#8209;GCM).
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            By continuing you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-coral-600">
              Privacy & Security
            </Link>{" "}
            commitments and{" "}
            <Link href="/community" className="underline hover:text-coral-600">
              Community Guidelines
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
