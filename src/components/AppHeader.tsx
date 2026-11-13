
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
    <header className="mb-7 flex items-center justify-between gap-5 border-b border-[#DEE3E4] pb-5">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center gap-1 rounded-xl bg-[#292E31]"
        >
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-5 w-1.5 -skew-x-[22deg] bg-[#D83036]"
            />
          ))}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-[#657A86]">
            JACKSON HOLE FIRE/EMS
          </p>
          <p className="text-lg font-extrabold tracking-tight text-[#292E31]">
            FITNESS <span className="text-[#D83036]">&</span> WELLNESS
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
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "border-[#292E31] bg-[#292E31] text-white"
                  : "border-[#D9DEDF] bg-white text-[#293035] hover:bg-[#EEF2F3]"
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
