"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

interface NavMenuProps {
  items: MenuItem[];
  orientation?: "horizontal" | "vertical";
}

/**
 * NavMenu
 * Reusable navigation menu component with active state
 */
export function NavMenu({ items, orientation = "horizontal" }: NavMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const orientationClass =
    orientation === "horizontal"
      ? "flex-row justify-around"
      : "flex-col items-start gap-2";

  return (
    <nav className={`flex ${orientationClass}`}>
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`nav-item ${isActive(item.href) ? "active" : ""}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
