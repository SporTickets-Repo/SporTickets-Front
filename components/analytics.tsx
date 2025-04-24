"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

export default function Analytics() {
  const path = usePathname();
  useEffect(() => {
    gtag.pageview(path);
  }, [path]);
  return null;
}
