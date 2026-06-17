"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/theme";

export default function ThemeSync() {
  const dark = useTheme((s) => s.dark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return null;
}
