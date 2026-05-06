import Header from "./Header";
import Footer from "./Footer";

export default function Shell({
  children,
  variant = "warm",
}: {
  children: React.ReactNode;
  variant?: "warm" | "plain";
}) {
  return (
    <div
      className={`flex flex-col min-h-screen ${variant === "warm" ? "bg-warm-gradient" : "bg-cream-50"}`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
