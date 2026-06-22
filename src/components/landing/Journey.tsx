const STEPS = [
  { n: "01", title: "Choose Product", desc: "Select from a curated range of professional formats." },
  { n: "02", title: "Configure Options", desc: "Choose weight, size, and premium finishes." },
  { n: "03", title: "Confirm Price", desc: "Instant transparent pricing — no hidden setup fees." },
  { n: "04", title: "Order Production", desc: "Express 24-hour turnaround on most projects." },
];

export function Journey() {
  return (
    <section className="px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <header className="mb-20 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Customer Journey
          </p>
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl">
            From idea to delivery in four steps.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <span className="mb-6 block font-serif text-7xl leading-none text-ink/10">
                {s.n}
              </span>
              <h3 className="mb-3 font-serif text-2xl tracking-tight">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
