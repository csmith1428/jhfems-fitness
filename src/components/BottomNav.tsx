
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "home" | "workouts" | "program" | "progress";

const tabs: {
  name: string;
  href: string;
  icon: IconName;
}[] = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Workouts", href: "/workouts", icon: "workouts" },
  { name: "Program", href: "/program", icon: "program" },
  { name: "Progress", href: "/progress", icon: "progress" },
];

function NavIcon({ name }: { name: IconName }) {
  const shared = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "home") {
    return (
      <svg {...shared}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-7h6v7" />
      </svg>
    );
  }

  if (name === "workouts") {
    return (
      <svg {...shared}>
        <rect x="2" y="9" width="3" height="6" rx="1" />
        <rect x="5" y="7" width="3" height="10" rx="1" />
        <path d="M8 12h8" />
        <rect x="16" y="7" width="3" height="10" rx="1" />
        <rect x="19" y="9" width="3" height="6" rx="1" />
      </svg>
    );
  }

  if (name === "program") {
    return (
      <svg {...shared}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
        <path d="M8 14h3v3H8z" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="M4 20V13h4v7" />
      <path d="M10 20V9h4v11" />
      <path d="M16 20V4h4v16" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#DDE2E4] bg-white/95 shadow-[0_-5px_22px_rgba(25,35,40,0.07)] backdrop-blur-md md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href ||
                pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#D83036] ${
                active
                  ? "text-[#D83036]"
                  : "text-[#738087] hover:text-[#293035]"
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#D83036]"
                />
              )}

              <NavIcon name={tab.icon} />

              <span
                className={`text-[11px] ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
