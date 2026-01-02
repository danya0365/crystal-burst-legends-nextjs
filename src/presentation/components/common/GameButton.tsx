"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * GameButton
 * Stylized game button with variants and glow effects
 */
export function GameButton({
  variant = "primary",
  size = "md",
  icon,
  children,
  fullWidth = false,
  className = "",
  ...props
}: GameButtonProps) {
  const variantClass = `game-button-${variant}`;
  const sizeClass = size !== "md" ? `game-button-${size}` : "";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`game-button ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </button>
  );
}
