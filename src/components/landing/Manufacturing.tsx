const CAPS = [
  { tag: "Precision", title: "Digital Offset", desc: "Digital speed with the richness of traditional lithography." },
  { tag: "Fidelity", title: "Color Management", desc: "FOGRA-calibrated process keeps brand color consistent across every batch." },
  { tag: "Tactility", title: "Specialist Finishing", desc: "In-house foil blocking, debossing, and artisan binding techniques." },
  { tag: "Velocity", title: "Agile Production", desc: "Rapid turnaround for time-sensitive launches without quality compromise." },
];

export function Manufacturing() {
  return (
    <section id="manufacturing" className="border-y border-border px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Manufacturing
          </p>
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
            Crafted by technology, finished by hand.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {CAPS.map((c) => (
            <div key={c.title} className="group">
              <div className="mb-6 h-px w-full bg-border transition-colors group-hover:bg-ink" />
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {c.tag}
              </p>
              <h3 className="mb-3 font-serif text-2xl tracking-tight">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
