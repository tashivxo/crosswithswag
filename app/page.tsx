"use client";

import { useCallback, useEffect, useState } from "react";
import { Preloader } from "@/components/v3/Preloader";
import { SiteHeader } from "@/components/v3/SiteHeader";
import { WordmarkDriftDock } from "@/components/v3/WordmarkDriftDock";
import { HomeChapter } from "@/components/v3/chapters/HomeChapter";
import { CurrentChapter } from "@/components/v3/chapters/CurrentChapter";
import { ArchiveChapter } from "@/components/v3/chapters/ArchiveChapter";
import { ManifestoChapter } from "@/components/v3/chapters/ManifestoChapter";
import { ContactChapter } from "@/components/v3/chapters/ContactChapter";
import { SiteFooter } from "@/components/v3/SiteFooter";
import { chapters, type ChapterId } from "@/lib/sections.config";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("home");

  const onPreloaderComplete = useCallback(() => {
    setReady(true);
    document.body.classList.remove("locked");
  }, []);

  useEffect(() => {
    document.body.classList.add("locked");

    const chapterElements = chapters.map((chapter) =>
      document.getElementById(chapter.id),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveChapter(visible[0].target.id as ChapterId);
        }
      },
      {
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    chapterElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-shell">
      <a href="#home" className="skip-link">
        skip to content
      </a>
      <Preloader onComplete={onPreloaderComplete} />
      <SiteHeader activeChapter={activeChapter} />
      <WordmarkDriftDock ready={ready} />
      <HomeChapter />
      <CurrentChapter />
      <ArchiveChapter />
      <ManifestoChapter />
      <ContactChapter />
      <SiteFooter />
    </main>
  );
}
