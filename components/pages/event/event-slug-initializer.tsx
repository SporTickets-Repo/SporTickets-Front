"use client";

import { useEvent } from "@/context/event";
import { useEffect } from "react";

type Props = {
  slug: string;
};

export default function EventSlugInitializer({ slug }: Props) {
  const { setSlug } = useEvent();

  useEffect(() => {
    const storedSlug = localStorage.getItem("eventSlug");

    if (slug && slug !== storedSlug) {
      localStorage.setItem("eventSlug", slug);
      setSlug(slug);
    }
  }, [slug, setSlug]);

  return null;
}
