import Header from "@/components/supportnest/Header";
import Footer from "@/components/supportnest/Footer";
import ToolHeader from "@/components/genetranslate/ToolHeader";

export default function GeneTranslateGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-sage-50">
      <Header />
      <ToolHeader />
      {children}
      <Footer />
    </div>
  );
}
