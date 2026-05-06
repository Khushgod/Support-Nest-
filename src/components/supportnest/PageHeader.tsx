export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const alignment =
    align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl";
  return (
    <div className={alignment}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-coral-600 mb-3">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
