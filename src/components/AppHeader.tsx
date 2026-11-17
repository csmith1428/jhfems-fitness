import Link from "next/link";

type Tab = "home" | "workouts" | "program" | "progress";

const links: { label: string; href: string; tab: Tab }[] = [
  { label: "Home", href: "/", tab: "home" },
  { label: "Workouts", href: "/workouts", tab: "workouts" },
  { label: "12-Week Program", href: "/program", tab: "program" },
  { label: "My Progress", href: "/progress", tab: "progress" },
];

export default function AppHeader({ active }: { active: Tab }) {
  return (
    <header className="mb-6 flex items-center justify-between gap-5">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-[var(--brand-night)]"
        >
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-4 w-1.5 -skew-x-[22deg] bg-[var(--brand-red)]"
            />
          ))}
        </div>

        <div className="min-w-0">
          <p className="font-display text-2xl font-extrabold uppercase leading-none text-[var(--brand-ink)]">
            JHFEMS Fitness
          </p>
        </div>
      </Link>

      <nav
        aria-label="Desktop navigation"
        className="hidden flex-wrap gap-2 md:flex"
      >
        {links.map((link) => {
          const selected = active === link.tab;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={selected ? "page" : undefined}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-[var(--brand-night)] text-white"
                  : "bg-white text-[var(--brand-ink)] shadow-[0_1px_4px_rgba(20,24,27,0.10)] hover:bg-[#EEF0EC]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
