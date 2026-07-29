"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { announcementMessages } from "@/lib/data";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcementMessages.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcementMessages.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const activeMessage = announcementMessages[index] ?? "Adults 21+ only";

  return (
    <div className="relative z-50 bg-primary text-primary-foreground">
      <Container className="grid h-8 grid-cols-[1fr_auto_1fr] items-center gap-4 text-[0.58rem] font-bold uppercase tracking-[0.16em] sm:h-9">
        <span className="hidden items-center gap-2 sm:flex">
          <span className="size-1.5 rounded-full bg-ink" />
          Verified adult store · 21+
        </span>
        <span
          className="col-span-3 animate-[ticker-in_350ms_ease-out_both] text-center sm:col-span-1"
          key={activeMessage}
        >
          {activeMessage}
        </span>
        <span className="hidden justify-self-end sm:block">Support · Mon–Sat</span>
      </Container>
    </div>
  );
}
