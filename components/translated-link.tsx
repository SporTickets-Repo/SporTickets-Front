"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

interface TranslatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  passHref?: boolean;
  target?: string;
  rel?: string;
}

export default function TranslatedLink({
  href,
  children,
  className = "",
  passHref = false,
  target = "_self",
  rel = "noopener noreferrer",
}: TranslatedLinkProps) {
  const { lang } = useParams();

  const normalizedHref = href.startsWith("/") ? href : `/${href}`;

  const localizedHref = `/${lang}${normalizedHref}`;

  return (
    <Link
      href={localizedHref}
      className={className}
      passHref={passHref}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
