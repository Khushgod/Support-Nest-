import Link from "next/link";
import Logo from "./Logo";

const SECTIONS = [
  {
    title: "Explore",
    items: [
      { href: "/community", label: "Community forum" },
      { href: "/events", label: "Events & workshops" },
      { href: "/resources", label: "Resources library" },
      { href: "/tools", label: "Free tools" },
    ],
  },
  {
    title: "For you",
    items: [
      { href: "/resources/parents", label: "For parents" },
      { href: "/resources/teachers", label: "For teachers" },
      { href: "/resources/neurodivergent-adults", label: "For ND adults" },
      { href: "/tools/genetranslate", label: "GeneTranslate" },
    ],
  },
  {
    title: "About",
    items: [
      { href: "/about", label: "Our mission" },
      { href: "/privacy", label: "Privacy & security" },
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Join free" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-cream-200 bg-cream-50/60 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              A warm, supportive nest for parents, teachers, and
              neurodivergent people &mdash; with free tools, a thoughtful
              community, and resources you can actually use.
            </p>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-600 hover:text-coral-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-cream-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[11px] leading-relaxed text-slate-500 max-w-3xl">
            SupportNest is built with care, but it does not provide medical,
            legal, or psychological advice. Please consult qualified
            professionals for clinical decisions. All uploads are encrypted in
            transit and at rest.
          </p>
          <p className="text-[11px] text-slate-400 whitespace-nowrap">
            &copy; {new Date().getFullYear()} SupportNest
          </p>
        </div>
      </div>
    </footer>
  );
}
