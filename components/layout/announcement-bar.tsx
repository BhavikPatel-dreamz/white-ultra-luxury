"use client";

import { useEffect, useState } from "react";
import { announcementMessages } from "@/lib/data";
import { Container } from "@/components/ui/container";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcementMessages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="border-b border-border bg-surface text-xs text-muted-foreground">
      <Container className="relative flex h-9 items-center justify-center overflow-hidden">
        <span className="absolute left-4 hidden text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-foreground md:block">
          Adult-use store
        </span>
        <span
          key={announcementMessages[index]}
          className="animate-[ticker-in_350ms_ease-out_both] text-center text-[0.66rem] font-semibold uppercase tracking-[0.12em]"
        >
          {announcementMessages[index]}
        </span>
      </Container>
    </div>
  );
}
