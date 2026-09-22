interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div
      className={`section-reveal mx-auto max-w-3xl ${isCenter ? "text-center" : "text-left"}`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-teal">
        {eyebrow}
      </span>
      <h2 className="font-display mt-4 text-balance text-4xl font-semibold text-foam sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-balance text-lg text-mist ${isCenter ? "" : "max-w-2xl"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
