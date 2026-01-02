"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "🏠", href: "/" },
  { id: "characters", label: "Characters", icon: "👥", href: "/characters" },
  { id: "story", label: "Story", icon: "📖", href: "/story" },
  { id: "pvp", label: "PVP", icon: "⚔️", href: "/pvp" },
  { id: "shop", label: "Shop", icon: "🛒", href: "/shop" },
  { id: "more", label: "More", icon: "☰", href: "/more" },
];

/**
 * MainFooter
 * Bottom navigation bar with game menu icons
 */
export function MainFooter() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <footer className="game-footer">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`nav-item ${isActive(item.href) ? "active" : ""}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </footer>
  );
}
