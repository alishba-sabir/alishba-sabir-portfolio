import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import portfolioHtml from "./portfolio-body.html?raw";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const header = container.querySelector("header");
    const hamburger = container.querySelector('button[aria-label="Open menu"]');

    // Header scroll effect
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Reveal on scroll
    const revealElements = Array.from(container.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));

    // Animate skill bars when they enter view
    const skillBars = Array.from(
      container.querySelectorAll<HTMLElement>("#skills .block.h-full.rounded-full")
    );
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const width = target.getAttribute("data-width");
            if (width) {
              target.style.width = width;
            }
            target.setAttribute("data-visible", "true");
            barObserver.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );
    skillBars.forEach((bar) => barObserver.observe(bar));

    // Mobile menu toggle
    const toggleMenu = () => setMobileOpen((prev) => !prev);
    hamburger?.addEventListener("click", toggleMenu);

    // Close mobile menu when clicking any anchor link inside the header
    const headerLinks = Array.from(container.querySelectorAll("header a[href^='#']"));
    const closeMenu = () => setMobileOpen(false);
    headerLinks.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      barObserver.disconnect();
      hamburger?.removeEventListener("click", toggleMenu);
      headerLinks.forEach((link) => link.removeEventListener("click", closeMenu));
    };
  }, []);

  return (
    <>
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: portfolioHtml }} />

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="mobile-menu open lg:hidden">
          <div className="flex items-center justify-between pb-4">
            <span className="font-display text-lg font-bold tracking-tight">Menu</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-col pt-4" onClick={() => setMobileOpen(false)}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#certification">Certification</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      )}
    </>
  );
}
