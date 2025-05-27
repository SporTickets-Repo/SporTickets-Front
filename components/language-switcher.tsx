"use client";

import { i18n, type Locale } from "@/i18n-config";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const BrazilFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#009739" rx="2" />
    <path d="M12 2L20 8L12 14L4 8L12 2Z" fill="#FEDD00" />
    <circle cx="12" cy="8" r="3" fill="#012169" />
    <path
      d="M10.5 6.5C10.5 6.5 11.5 7 12.5 7C13.5 7 14.5 6.5 14.5 6.5"
      stroke="#FEDD00"
      strokeWidth="0.5"
      fill="none"
    />
    <path
      d="M9.5 8.5C9.5 8.5 11 9.5 12 9.5C13 9.5 14.5 8.5 14.5 8.5"
      stroke="#FEDD00"
      strokeWidth="0.5"
      fill="none"
    />
  </svg>
);

const USAFlag = ({ className = "w-6 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 16" fill="none">
    <rect width="24" height="16" fill="#B22234" rx="2" />
    <rect width="24" height="1.23" y="1.23" fill="white" />
    <rect width="24" height="1.23" y="3.69" fill="white" />
    <rect width="24" height="1.23" y="6.15" fill="white" />
    <rect width="24" height="1.23" y="8.61" fill="white" />
    <rect width="24" height="1.23" y="11.08" fill="white" />
    <rect width="24" height="1.23" y="13.54" fill="white" />
    <rect width="9.6" height="8.61" fill="#3C3B6E" />
    <g fill="white">
      <circle cx="1.6" cy="1.5" r="0.3" />
      <circle cx="3.2" cy="1.5" r="0.3" />
      <circle cx="4.8" cy="1.5" r="0.3" />
      <circle cx="6.4" cy="1.5" r="0.3" />
      <circle cx="8" cy="1.5" r="0.3" />
      <circle cx="2.4" cy="2.5" r="0.3" />
      <circle cx="4" cy="2.5" r="0.3" />
      <circle cx="5.6" cy="2.5" r="0.3" />
      <circle cx="7.2" cy="2.5" r="0.3" />
      <circle cx="1.6" cy="3.5" r="0.3" />
      <circle cx="3.2" cy="3.5" r="0.3" />
      <circle cx="4.8" cy="3.5" r="0.3" />
      <circle cx="6.4" cy="3.5" r="0.3" />
      <circle cx="8" cy="3.5" r="0.3" />
      <circle cx="2.4" cy="4.5" r="0.3" />
      <circle cx="4" cy="4.5" r="0.3" />
      <circle cx="5.6" cy="4.5" r="0.3" />
      <circle cx="7.2" cy="4.5" r="0.3" />
      <circle cx="1.6" cy="5.5" r="0.3" />
      <circle cx="3.2" cy="5.5" r="0.3" />
      <circle cx="4.8" cy="5.5" r="0.3" />
      <circle cx="6.4" cy="5.5" r="0.3" />
      <circle cx="8" cy="5.5" r="0.3" />
      <circle cx="2.4" cy="6.5" r="0.3" />
      <circle cx="4" cy="6.5" r="0.3" />
      <circle cx="5.6" cy="6.5" r="0.3" />
      <circle cx="7.2" cy="6.5" r="0.3" />
      <circle cx="1.6" cy="7.5" r="0.3" />
      <circle cx="3.2" cy="7.5" r="0.3" />
      <circle cx="4.8" cy="7.5" r="0.3" />
      <circle cx="6.4" cy="7.5" r="0.3" />
      <circle cx="8" cy="7.5" r="0.3" />
    </g>
  </svg>
);

const localeConfig = {
  pt: {
    label: "Português",
    flag: <BrazilFlag />,
    code: "pt-BR",
  },
  en: {
    label: "English",
    flag: <USAFlag />,
    code: "en-US",
  },
} as const;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = (pathname?.split("/")[1] as Locale) || "pt";

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const currentConfig = localeConfig[currentLocale];

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-black"
      >
        <div className="flex items-center">{currentConfig.flag}</div>
        <span className="text-sm font-medium">{currentConfig.code}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20 min-w-[160px]">
            {i18n.locales.map((locale) => {
              const config = localeConfig[locale as keyof typeof localeConfig];
              const isActive = locale === currentLocale;

              return (
                <Link
                  key={locale}
                  href={redirectedPathname(locale)}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center">{config.flag}</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-xs text-gray-500">{config.code}</span>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
