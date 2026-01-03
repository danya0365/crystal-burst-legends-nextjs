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
  { id: "home", label: "Home", icon: "🏠", href: "/game" },
  { id: "characters", label: "Characters", icon: "👥", href: "/game/characters" },
  { id: "story", label: "Story", icon: "📖", href: "/game/story" },
  { id: "pvp", label: "PVP", icon: "⚔️", href: "/game/pvp" },
  { id: "shop", label: "Shop", icon: "🛒", href: "/game/shop" },
  { id: "more", label: "More", icon: "☰", href: "/game/more" },
];

/**
 * MainFooter
 * Bottom navigation bar with game menu icons
 */
export function MainFooter() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/game") {
      return pathname === "/game";
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
