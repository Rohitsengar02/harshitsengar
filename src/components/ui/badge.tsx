"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
  className?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "default":
          return "bg-primary text-primary-foreground hover:bg-primary/80";
        case "secondary":
          return "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700";
        case "outline":
          return "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300";
        case "success":
          return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
        case "warning":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
        case "danger":
          return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
        default:
          return "bg-primary text-primary-foreground hover:bg-primary/80";
      }
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${getVariantClasses()} ${className || ""}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
