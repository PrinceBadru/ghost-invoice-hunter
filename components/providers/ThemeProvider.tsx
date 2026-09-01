"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export type ThemeVariant = "signal" | "midnight" | "aurora" | "slate";

interface ThemeContextType {
  activeTheme: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [activeTheme, setActiveTheme] = useState<ThemeVariant>("signal");

  useEffect(() => {
    // Load saved theme variant or fallback to 'signal'
    const savedVariant = (localStorage.getItem("gih-theme-variant") as ThemeVariant) || "signal";
    setActiveTheme(savedVariant);
    document.documentElement.setAttribute("data-theme", savedVariant);
  }, []);

  const setThemeVariant = (variant: ThemeVariant) => {
    setActiveTheme(variant);
    localStorage.setItem("gih-theme-variant", variant);
    document.documentElement.setAttribute("data-theme", variant);
  };

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ activeTheme, setThemeVariant }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useThemeVariant = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeVariant must be used within a ThemeProvider");
  }
  return context;
};