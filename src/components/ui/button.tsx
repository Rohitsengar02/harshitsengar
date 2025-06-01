"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "default":
          return "bg-primary text-white hover:bg-primary/90";
        case "outline":
          return "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
        case "ghost":
          return "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
        case "link":
          return "text-primary underline-offset-4 hover:underline";
        case "destructive":
          return "bg-red-500 text-white hover:bg-red-600";
        default:
          return "bg-primary text-white hover:bg-primary/90";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "h-8 px-3 text-xs";
        case "default":
          return "h-10 px-4 py-2";
        case "lg":
          return "h-12 px-6 text-lg";
        default:
          return "h-10 px-4 py-2";
      }
    };

    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className || ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
