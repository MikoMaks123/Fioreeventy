// Nagłówek sekcji: eyebrow + H2 + opcjonalny lead. `tone` steruje kolorami
// (dark = sekcja ciemna, light = sekcja na --cream).

type Props = {
  eyebrow: string;
  h2: string;
  lead?: string;
  tone?: "dark" | "light";
  center?: boolean;
};

export default function SectionHeader({ eyebrow, h2, lead, tone = "dark", center = false }: Props) {
  const dark = tone === "dark";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl`} data-section-header>
      <p
        className={`text-[11px] font-medium uppercase tracking-[0.3em] md:text-xs ${
          dark ? "text-gold" : "text-ink/60"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display font-medium tracking-[-0.02em] text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.1] ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {h2}
      </h2>
      {lead && (
        <p className={`mt-4 text-lg ${dark ? "text-cream-dim" : "text-ink/70"}`}>{lead}</p>
      )}
    </div>
  );
}
