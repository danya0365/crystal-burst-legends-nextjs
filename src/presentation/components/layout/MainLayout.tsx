"use client";

import { ReactNode } from "react";
import { MainFooter } from "./MainFooter";
import { MainHeader } from "./MainHeader";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

/**
 * MainLayout
 * Full-screen game layout with Header, Content area, and Footer
 * No scrolling - designed for web app experience
 */
export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="layout-fullscreen">
      {showHeader && <MainHeader />}
      
      <main className="layout-content">
        {children}
      </main>
      
      {showFooter && <MainFooter />}
    </div>
  );
}
