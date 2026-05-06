import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Shell from "@/components/supportnest/Shell";
import { getCurrentUser } from "@/lib/auth/dal";
import NewThreadForm from "./NewThreadForm";
import { SPACES, type SpaceId } from "@/lib/forum/types";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Start a thread | SupportNest community",
};

export default async function NewThreadPage({
  searchParams,
}: {
  searchParams: Promise<{ space?: string; replyTo?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/community/new");

  const sp = await searchParams;
  const initialSpace =
    sp.space && SPACES.some((s) => s.id === sp.space)
      ? (sp.space as SpaceId)
      : "first-steps";

  return (
    <Shell>
      <section className="py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-coral-600 mb-3"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to community
          </Link>

          <div className="rounded-3xl border border-cream-200 bg-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Start a thread
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Posting as{" "}
              <span className="font-medium text-slate-800">
                {user.name.split(" ")[0]}
              </span>
              . Lead with kindness. Use a content note for heavy topics.
              Tag your audience so the right people see it.
            </p>

            <div className="mt-6">
              <NewThreadForm initialSpace={initialSpace} />
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Drafts are kept in your browser as you type. Refreshing
            won&rsquo;t lose your work.
          </p>
        </div>
      </section>
    </Shell>
  );
}
