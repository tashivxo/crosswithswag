"use client";

import { useCallback, useEffect, useState } from "react";
import { Preloader } from "@/components/v3/Preloader";
import { SiteHeader } from "@/components/v3/SiteHeader";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";
import { CurrentChapter } from "@/components/v3/chapters/CurrentChapter";
import { ArchiveChapter } from "@/components/v3/chapters/ArchiveChapter";
import { ManifestoChapter } from "@/components/v3/chapters/ManifestoChapter";
import { ContactChapter } from "@/components/v3/chapters/ContactChapter";
import { SiteFooter } from "@/components/v3/SiteFooter";

export default function Home() {
  const [ready, setReady] = useState(false);

  const onPreloaderComplete = useCallback(() => {
    setReady(true);
    document.body.classList.remove("locked");
  }, []);

  useEffect(() => {
    document.body.classList.add("locked");
  }, []);

  return (
    <main className="page-shell">
      <a href="#home" className="skip-link">
        skip to content
      </a>
      <Preloader onComplete={onPreloaderComplete} />
      <SiteHeader ready={ready} />
      <HomeChapter />
      <CurrentChapter />
      <ArchiveChapter />
      <ManifestoChapter />
      <ContactChapter />
      <SiteFooter />
    </main>
  );
}
