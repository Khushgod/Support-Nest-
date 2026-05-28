import Link from "next/link";
import Logo from "./Logo";
import { getCurrentUser } from "@/lib/auth/dal";
import SensoryModeToggle from "@/components/theme/SensoryModeToggle";

const NAV = [
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/resources", label: "Resources" },
  { href: "/tools", label: "Tools" },
  { href: "/about", label: "About" },
];

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="w-full border-b border-cream-200/80 bg-white/85 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 hover:text-coral-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-cream-100 transition-colors"
              >
                Hi, {user.name.split(" ")[0]}
              </Link>
              <Link
                href="/dashboard"
                className="sm:hidden text-sm font-medium text-slate-700"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-coral-600 transition-colors px-2 py-1.5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Join free
              </Link>
            </>
          )}
          <div className="hidden lg:block">
            <SensoryModeToggle />
          </div>
        </div>
      </div>

      <nav className="border-t border-cream-200/80 bg-white md:hidden">
        <ul className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-3 overflow-x-auto py-2 text-xs font-medium">
          <li className="flex-shrink-0">
            <SensoryModeToggle className="px-2.5 py-1.5" />
          </li>
          {NAV.map((item) => (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href}
                className="text-slate-600 hover:text-coral-600 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
