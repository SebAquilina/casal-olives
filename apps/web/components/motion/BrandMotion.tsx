"use client";
import { useEffect } from "react";

/**
 * Casal Olives — grove-pastoral motion.
 * - Bottle parallax on hero (slight tilt as page scrolls)
 * - Lead paragraph fades in with the dropcap blooming first
 * - Topographic SVG lines draw stroke-by-stroke as you scroll
 * - Olive ornaments rotate in
 * - Slow, agrarian — like watching a sunset
 */
export function BrandMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.documentElement.classList.add("co-no-motion");
      return;
    }
    document.documentElement.classList.add("js-motion");

    // IO for entrance reveals
    const reveals = document.querySelectorAll<HTMLElement>(
      "main section, main h1, main h2, main h3, main p.lead, main p.eyebrow, .oil-card-img, .oil-detail-img, .co-reveal, blockquote, table, ul, ol"
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px 30% 0px" }
    );
    reveals.forEach((t) => io.observe(t));
    // Re-scan after async-rendered sections appear
    const _reScan = () => {
      // Re-run the same query selectors and observe any new elements
    };
    [400, 1200, 2500].forEach((ms) => setTimeout(() => {
      document.querySelectorAll<HTMLElement>(
        "main section, main h1, main h2, main h3, main p.lead, main p.eyebrow, .work-tile, .work-card, .session-card, .next-sessions-grid > *, .oil-card-img, .oil-detail-img, .collection-card-img, .catalog-card-img, .oil-card-img-link, .product-image-main, .journal-card, .journal-row, .sale-badge, blockquote, ul, ol, table"
      ).forEach((t) => {
        const tt = t as HTMLElement & { __observed?: boolean };
        if (!tt.__observed) { tt.__observed = true; io.observe(t); }
      });
    }, ms));

    // Parallax — bottle/grove illustration on home (very subtle)
    let scrollY = 0;
    let ticking = false;
    function onScroll() {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--co-scroll", String(scrollY));
          // Tilt the front-hero illustration slightly with scroll
          const hero = document.querySelector<HTMLElement>(".oil-detail-img, .front-hero, .hero-image");
          if (hero) {
            const tilt = Math.min(scrollY / 60, 6); // max 6deg
            hero.style.setProperty("--co-tilt", `${tilt}deg`);
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
