
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ─── LENIS SMOOTH SCROLL ─────────────────────────────────── */
const lenis = new Lenis({
  lerp: 0.07,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.5,
  syncTouch: false,
  infinite: false,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ─── THEME ───────────────────────────────────────────────── */
const toggle = document.getElementById("theme-toggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (toggle) toggle.setAttribute("aria-pressed", theme === "dark");
  try {
    localStorage.setItem("sipply-theme", theme);
  } catch (e) {}
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("sipply-theme");
} catch (e) {}

setTheme(
  savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),
);

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
}

/* ─── HEADER HIDE ON SCROLL DOWN ─────────────────────────── */
const header = document.querySelector(".site-header");
let lastScrollY = 0;

lenis.on("scroll", ({ scroll }) => {
  if (header) {
    header.classList.toggle("hidden", scroll > lastScrollY && scroll > 80);
  }
  lastScrollY = scroll;
});

/* ─── ROTATING WHEEL ──────────────────────────────────────── */
const wheelItems = document.querySelectorAll(".wheel-item");
let currentIndex = 0;

if (wheelItems.length) {
  gsap.set(wheelItems[0], { y: 0, rotateX: 0, opacity: 1 });
  gsap.set(Array.from(wheelItems).slice(1), { y: 60, rotateX: 40, opacity: 0 });

  function rotateWheel() {
    const prev = currentIndex;
    currentIndex = (currentIndex + 1) % wheelItems.length;
    gsap.to(wheelItems[prev], {
      y: -80,
      rotateX: -50,
      opacity: 0,
      duration: 0.75,
      ease: "power3.inOut",
    });
    gsap.fromTo(
      wheelItems[currentIndex],
      { y: 80, rotateX: 50, opacity: 0 },
      { y: 0, rotateX: 0, opacity: 1, duration: 0.75, ease: "power3.inOut" },
    );
  }

  setInterval(rotateWheel, 3000);
}

/* ─── HERO PARALLAX ───────────────────────────────────────── */
if (document.querySelector(".hero")) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.4,
      },
    })
    .to(".hero-title", { yPercent: -16, ease: "none" }, 0)
    .to(".hero-sub", { yPercent: -28, ease: "none" }, 0)
    .to(".hero-actions", { yPercent: -40, ease: "none" }, 0);
}

/* ─── SECTION TITLE WIPE-IN (clip-path) ──────────────────── */
gsap.utils.toArray(".section-title").forEach((title) => {
  if (title.classList.contains("services-heading")) return;
  gsap.fromTo(
    title,
    { clipPath: "inset(100% 0% 0% 0%)", y: 36, opacity: 0 },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: title,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    },
  );
});

/* ─── INTRO TEXT ──────────────────────────────────────────── */
if (document.querySelector(".intro-text")) {
  gsap.fromTo(
    ".intro-text",
    { y: 70, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".intro-section",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );
}

/* ─── CLIENT LOGO MARQUEE ─────────────────────────────────── */
(function () {
  const track = document.getElementById("client-logos-track");
  if (!track) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  track.classList.add("is-marquee-running");
})();

/* ─── SERVICES — sticky counter + row reveals ─────────────── */
if (document.querySelector(".services-section")) {
  gsap.fromTo(
    ".services-eyebrow",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".services-heading",
    { clipPath: "inset(100% 0% 0% 0%)", y: 30, opacity: 0 },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 75%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".services-counter-wrap",
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: ".services-section",
        start: "top 75%",
        toggleActions: "play none none none",
      },
    },
  );

  const serviceRows = document.querySelectorAll(".service-row");
  const counterEl = document.getElementById("services-counter");
  const servicesSection = document.querySelector(".services-section");

  function updateServiceWash(activeRow) {
    const idx = activeRow.getAttribute("data-index") || "1";
    servicesSection.setAttribute("data-active", idx);
  }

  function updateCounter(n) {
    if (!counterEl) return;
    const padded = String(n).padStart(2, "0");
    gsap.to(counterEl, {
      opacity: 0,
      y: -14,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        counterEl.textContent = padded;
        gsap.fromTo(
          counterEl,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" },
        );
      },
    });
  }

  serviceRows.forEach((row, i) => {
    const num = row.querySelector(".service-num");
    const titleEl = row.querySelector(".service-title");
    const line = row.querySelector(".service-line line");
    const body = row.querySelector(".service-row-body");

    gsap.set(row, { borderTopColor: "transparent" });
    gsap.set(num, { opacity: 0, x: -24 });
    gsap.set(titleEl, { clipPath: "inset(0% 100% 0% 0%)", opacity: 1 });
    gsap.set(line, { strokeDasharray: 600, strokeDashoffset: 600 });
    gsap.set(body, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 72%",
        toggleActions: "play none none none",
      },
    });

    tl.to(
      row,
      { borderTopColor: "var(--line)", duration: 0.5, ease: "none" },
      0,
    )
      .to(num, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }, 0.1)
      .to(
        titleEl,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.out" },
        0.2,
      )
      .to(
        line,
        { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" },
        0.35,
      )
      .to(body, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.55);

    ScrollTrigger.create({
      trigger: row,
      start: "top 55%",
      onEnter: () => {
        updateCounter(i + 1);
        updateServiceWash(row);
      },
      onEnterBack: () => {
        updateCounter(i + 1);
        updateServiceWash(row);
      },
    });
  });
}

/* ─── WORK CARDS ──────────────────────────────────────────── */
if (document.querySelector(".work-grid")) {
  gsap.fromTo(
    ".work-card",
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      stagger: { amount: 0.4, from: "start" },
      scrollTrigger: {
        trigger: ".work-grid",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.utils.toArray(".work-image").forEach((image) => {
    gsap.fromTo(
      image,
      { scale: 1.18 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });
}

/* ─── SERVICES PREVIEW (index.html) ──────────────────────── */
if (document.querySelector(".services-preview-grid")) {
  gsap.fromTo(
    ".services-preview-item",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".services-preview-grid",
        start: "top 85%",
        toggleActions: "play none none none",
      },
    },
  );
}

/* ─── ABOUT ───────────────────────────────────────────────── */
if (document.querySelector("#about")) {
  gsap.fromTo(
    ".about-text p",
    { x: -60, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".about-image",
    { scale: 1.12, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.4,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );
}

/* ─── CONSULTATION ────────────────────────────────────────── */
if (document.querySelector("#consultation")) {
  gsap.fromTo(
    "#consultation .consultation-intro",
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: "#consultation",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    "#consultation .notice",
    { y: 40, opacity: 0, scale: 0.98 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: "power3.out",
      delay: 0.15,
      scrollTrigger: {
        trigger: "#consultation",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    "#consultation .consultation-actions",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.25,
      scrollTrigger: {
        trigger: "#consultation",
        start: "top 78%",
        toggleActions: "play none none none",
      },
    },
  );
}

/* ─── FAQ CARDS ───────────────────────────────────────────── */
if (document.querySelector("#faq")) {
  gsap.fromTo(
    ".faq-card",
    { y: 70, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.0,
      ease: "power4.out",
      stagger: { amount: 0.5, grid: [2, 3], from: "start" },
      scrollTrigger: {
        trigger: "#faq",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );
}

/* ─── SMOOTH ANCHOR SCROLL (via Lenis) ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    lenis.scrollTo(target, {
      offset: -90,
      duration: 1.6,
      easing: (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });
  });
});

/* ─── SELECTION COLOUR CYCLE ─────────────────────────────── */
const selectionColours = [
  "#FF3B3B",
  "#FF9500",
  "#FFD60A",
  "#34C759",
  "#007AFF",
  "#BF5AF2",
];
let selectionIndex = 0;

function advanceSelectionColour() {
  const colour = selectionColours[selectionIndex % selectionColours.length];
  selectionIndex++;
  document.documentElement.style.setProperty("--selection-bg", colour);
  document.documentElement.style.setProperty("--selection-text", "#000000");
}

document.addEventListener("mousedown", advanceSelectionColour);
document.addEventListener("touchstart", advanceSelectionColour, {
  passive: true,
});

/* ─── BUTTON HOVER COLOUR CYCLE ───────────────────────────── */
(function () {
  const hoverColours = [
    "#FF3B3B",
    "#FF9500",
    "#FFD60A",
    "#34C759",
    "#007AFF",
    "#BF5AF2",
  ];

  document.querySelectorAll(".button, .client-visit-pill").forEach((btn) => {
    let colourIndex = Math.floor(Math.random() * hoverColours.length);

    btn.addEventListener("mouseenter", () => {
      const colour = hoverColours[colourIndex % hoverColours.length];
      colourIndex++;
      btn.style.setProperty("--btn-hover-colour", colour);
    });
  });
})();

/* ─── REFRESH AFTER LOAD ──────────────────────────────────── */
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
  if (typeof lenis.resize === "function") lenis.resize();
});

/* ─── HERO QUOTE BUILDER MODULE ───────────────────────────── */
(function () {
  const quoteModule = document.getElementById("quote-module");
  const quoteLaunch = document.getElementById("quote-launch");
  const quotePopup = document.getElementById("quote-popup");
  const quotePopupPanel =
    quotePopup && quotePopup.querySelector(".quote-popup-panel");
  const quotePopupBackdrop = document.getElementById("quote-popup-backdrop");
  const quotePopupClose = document.getElementById("quote-popup-close");

  if (
    !quoteModule ||
    !quoteLaunch ||
    !quotePopup ||
    !quotePopupPanel ||
    !quotePopupBackdrop ||
    !quotePopupClose
  ) {
    return;
  }

  let isPopupOpen = false;
  let floatXTween = null;
  let floatYTween = null;

  gsap.set(quoteModule, { x: 24, y: 36 });

  const blobA = quoteModule.querySelector(".quote-aurora-a");
  const blobB = quoteModule.querySelector(".quote-aurora-b");
  const blobC = quoteModule.querySelector(".quote-aurora-c");

  function animBlob(el, xR, yR, dur) {
    if (!el) return;
    gsap.to(el, {
      x: (Math.random() * 2 - 1) * xR,
      y: (Math.random() * 2 - 1) * yR,
      duration: dur + Math.random() * 0.8,
      ease: "sine.inOut",
      onComplete: () => animBlob(el, xR, yR, dur),
    });
  }

  animBlob(blobA, 44, 36, 3.0);
  animBlob(blobB, 40, 40, 3.6);
  animBlob(blobC, 34, 30, 2.7);

  const baseX = 24;
  const baseY = 36;

  function floatX() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    floatXTween = gsap.to(quoteModule, {
      x: baseX + (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 5),
      duration: 2.6 + Math.random() * 0.8,
      ease: "sine.inOut",
      onComplete: floatX,
    });
  }

  function floatY() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    floatYTween = gsap.to(quoteModule, {
      y: baseY + (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 5),
      duration: 3.2 + Math.random() * 1.0,
      ease: "sine.inOut",
      onComplete: floatY,
    });
  }

  function startIdleFloat() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (floatXTween) floatXTween.kill();
    if (floatYTween) floatYTween.kill();
    floatX();
    floatY();
  }

  function stopIdleFloat() {
    if (floatXTween) {
      floatXTween.kill();
      floatXTween = null;
    }
    if (floatYTween) {
      floatYTween.kill();
      floatYTween = null;
    }
  }

  startIdleFloat();

  const quoteBounds = document.getElementById("quote-drag-bounds");
  if (quoteBounds) {
    quoteBounds.addEventListener("pointermove", (e) => {
      if (isPopupOpen) return;
      const rect = quoteModule.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const str = Math.max(0, 1 - dist / 280);
      stopIdleFloat();
      gsap.to(quoteModule, {
        x: baseX + dx * 0.06 * str,
        y: baseY + dy * 0.06 * str,
        duration: 0.55,
        ease: "power3.out",
      });
    });

    quoteBounds.addEventListener("pointerleave", () => {
      if (isPopupOpen) return;
      gsap.to(quoteModule, {
        x: baseX,
        y: baseY,
        duration: 0.7,
        ease: "power3.out",
        onComplete: startIdleFloat,
      });
    });
  }

  quoteModule.addEventListener("mouseenter", () => {
    if (isPopupOpen) return;
    gsap.to(quoteModule, { scale: 1.03, duration: 0.22, ease: "power2.out" });
  });

  quoteModule.addEventListener("mouseleave", () => {
    if (isPopupOpen) return;
    gsap.to(quoteModule, { scale: 1, duration: 0.22, ease: "power2.out" });
  });

  function openQuotePopup() {
    isPopupOpen = true;
    stopIdleFloat();
    lenis.stop();
    quotePopup.classList.add("is-open");
    quotePopup.setAttribute("aria-hidden", "false");
    quoteModule.setAttribute("aria-expanded", "true");
    gsap.killTweensOf([quotePopupBackdrop, quotePopupPanel, quoteModule]);
    gsap.to(quoteModule, {
      scale: 0.94,
      opacity: 0.18,
      duration: 0.32,
      ease: "power2.out",
    });
    gsap.to(quotePopupBackdrop, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(quotePopupPanel, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.46,
      ease: "power3.out",
      onComplete: () => {
        quotePopupPanel.style.pointerEvents = "auto";
      },
    });
  }

  function closeQuotePopup() {
    isPopupOpen = false;
    quotePopupPanel.style.pointerEvents = "none";
    lenis.start();
    quotePopup.setAttribute("aria-hidden", "true");
    quoteModule.setAttribute("aria-expanded", "false");
    gsap.to(quotePopupBackdrop, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.out",
    });
    gsap.to(quotePopupPanel, {
      opacity: 0,
      y: 24,
      scale: 0.92,
      duration: 0.34,
      ease: "power2.out",
      onComplete: () => quotePopup.classList.remove("is-open"),
    });
    gsap.to(quoteModule, {
      scale: 1,
      opacity: 1,
      x: baseX,
      y: baseY,
      duration: 0.38,
      ease: "power2.out",
      onComplete: startIdleFloat,
    });
  }

  quoteModule.addEventListener("click", () => {
    if (!isPopupOpen) openQuotePopup();
  });

  quoteLaunch.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isPopupOpen) openQuotePopup();
  });

  quoteModule.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isPopupOpen) {
      e.preventDefault();
      openQuotePopup();
    }
  });

  quotePopupClose.addEventListener("click", closeQuotePopup);
  quotePopupBackdrop.addEventListener("click", closeQuotePopup);

  quotePopupPanel.addEventListener("wheel", (e) => e.stopPropagation(), {
    passive: true,
  });

  quotePopupPanel.addEventListener("touchmove", (e) => e.stopPropagation(), {
    passive: true,
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isPopupOpen) closeQuotePopup();
  });

  const pricing = {
    "Strategy & Content": {
      "Small · 1–3 deliverables": [800, 1500],
      "Medium · 4–8 deliverables": [1500, 3200],
      "Large · 9+ deliverables": [3200, 6000],
      "Not sure yet": [1100, 3200],
    },
    "SEO / AEO": {
      "Small · 1–3 deliverables": [600, 1200],
      "Medium · 4–8 deliverables": [1200, 2800],
      "Large · 9+ deliverables": [2800, 5500],
      "Not sure yet": [800, 3000],
    },
    "CRO & Optimisation": {
      "Small · 1–3 deliverables": [700, 1400],
      "Medium · 4–8 deliverables": [1400, 3000],
      "Large · 9+ deliverables": [3000, 5800],
      "Not sure yet": [1000, 3200],
    },
    "Website Copy": {
      "Small · 1–3 deliverables": [700, 1400],
      "Medium · 4–8 deliverables": [1400, 3200],
      "Large · 9+ deliverables": [3200, 6800],
      "Not sure yet": [1000, 3600],
    },
    "Market Analysis": {
      "Small · 1–3 deliverables": [500, 1000],
      "Medium · 4–8 deliverables": [1000, 2400],
      "Large · 9+ deliverables": [2400, 4500],
      "Not sure yet": [700, 2600],
    },
    "Social & Email": {
      "Small · 1–3 deliverables": [500, 1000],
      "Medium · 4–8 deliverables": [1000, 2200],
      "Large · 9+ deliverables": [2200, 4200],
      "Not sure yet": [700, 2400],
    },
    "Reputation & GMB": {
      "Small · 1–3 deliverables": [450, 900],
      "Medium · 4–8 deliverables": [900, 1900],
      "Large · 9+ deliverables": [1900, 3600],
      "Not sure yet": [600, 2000],
    },
    "Full Package": {
      "Small · 1–3 deliverables": [2200, 3800],
      "Medium · 4–8 deliverables": [4800, 8500],
      "Large · 9+ deliverables": [9500, 16000],
      "Not sure yet": [3000, 8500],
    },
  };

  const urgencyMultiplier = {
    "Urgent · <2 weeks": 1.3,
    "This month": 1.1,
    "Next 1–3 months": 1.0,
    "Just exploring": 1.0,
  };

  // Hourly rate is not finalized yet — set to null to hide hours in the estimate.
  // Once a rate is confirmed, set this to a number (e.g. 175) to re-enable the hours line.
  const HOURLY_RATE = null;

  function getSelected(group) {
    const btn = quotePopup.querySelector(
      `.quote-choice-row[data-group="${group}"] button.is-selected`,
    );
    return btn ? btn.getAttribute("data-val") : null;
  }

  function updateEstimate() {
    const service = getSelected("service");
    const size = getSelected("size");
    const timeline = getSelected("timeline");

    const estimateBoxEl = document.getElementById("quote-estimate-box");
    const estimateResultEl = document.getElementById("quote-estimate-result");
    const rangeEl = document.getElementById("quote-estimate-range");
    const hoursEl = document.getElementById("quote-estimate-hours");
    const noteEl = document.getElementById("quote-estimate-note");

    if (!service || !size) {
      estimateBoxEl.style.display = "block";
      estimateResultEl.style.display = "none";
      return;
    }

    const baseRange = pricing[service] ? pricing[service][size] : null;
    if (!baseRange) {
      estimateBoxEl.style.display = "block";
      estimateResultEl.style.display = "none";
      return;
    }

    const multiplier = timeline ? urgencyMultiplier[timeline] : 1.0;
    const low = Math.round((baseRange[0] * multiplier) / 25) * 25;
    const high = Math.round((baseRange[1] * multiplier) / 25) * 25;

    rangeEl.textContent = `$${low.toLocaleString()} – $${high.toLocaleString()}`;

    if (HOURLY_RATE) {
      const lowHours = Math.round(low / HOURLY_RATE);
      const highHours = Math.round(high / HOURLY_RATE);
      hoursEl.textContent = `Roughly ${lowHours}–${highHours} hours at $${HOURLY_RATE}/hr`;
      hoursEl.style.display = "block";
    } else {
      hoursEl.textContent = "";
      hoursEl.style.display = "none";
    }

    let note = "This is a starting estimate. Final scope and pricing confirmed after a quick consultation.";
    if (timeline === "Urgent · <2 weeks") {
      note = "Includes a 30% rush fee for turnaround under 2 weeks. Final scope confirmed after a quick consultation.";
    } else if (size === "Not sure yet") {
      note = "This is a starting range — most projects like yours land here. We'll nail down specifics together.";
    }
    noteEl.textContent = note;

    estimateBoxEl.style.display = "none";
    estimateResultEl.style.display = "block";
  }

  quotePopup.querySelectorAll(".quote-choice-row button").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn
        .closest(".quote-choice-row")
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      updateEstimate();
    });
  });

  window.addEventListener("resize", () => {
    gsap.set(quoteModule, { x: baseX, y: baseY });
    ScrollTrigger.refresh();
  });
})();

/* ─── BURGER MENU ─────────────────────────────────────────── */
(function () {
  const burger = document.getElementById("burger");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileLinks = mobileNav
    ? mobileNav.querySelectorAll(".mobile-nav-links a")
    : [];
  const mobileToggle = document.getElementById("theme-toggle-mobile");
  const mobileNavClose = document.getElementById("mobile-nav-close");

  if (!burger || !mobileNav) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    burger.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    lenis.stop();
  }

  function closeMenu() {
    isOpen = false;
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    lenis.start();
  }

  burger.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  if (mobileNavClose) {
    mobileNavClose.addEventListener("click", closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      closeMenu();

      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            lenis.scrollTo(target, { offset: -90, duration: 1.4 });
          }, 380);
        }
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   services.html
═══════════════════════════════════════════════════════════ */
if (document.getElementById("srv-sticky-wrap")) {
  gsap.fromTo(
    ".srv-eyebrow span",
    { y: "110%" },
    { y: "0%", duration: 1, ease: "power4.out", delay: 0.1 },
  );
  gsap.fromTo(
    ".srv-hero-title .tline span",
    { y: "110%" },
    { y: "0%", duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.2 },
  );
  gsap.fromTo(
    ".srv-hero-right",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", delay: 0.4 },
  );

  const srvServices = [
    {
      tag: "Strategy",
      title: ["Content", "Strategy"],
      desc: "Content strategy is the backbone of every brand to get you noticed. I will take a closer look at your audience, define your voice, and build editorial roadmaps so you can connect with your audience more efficiently."
    },
    {
      tag: "Search",
      title: ["SEO", "& AEO"],
      desc: "My goal for your website is simple: I want you to rank above your competitors. My expertise in optimizing both the user experience and search rankings can help you achieve higher visibility, more traffic, and better conversions.",
    },
    {
      tag: "Conversion",
      title: ["CRO &", "Optimisation"],
      desc: "Traffic without conversion is just noise. We analyse your funnel, identify where visitors drop off, and redesign the copy and flow to guide users confidently toward action.",
    },
    {
      tag: "Copy",
      title: ["Website", "Copywriting"],
      desc: "Your website is your best salesperson. We write homepage, service, and about copy that speaks to real humans — sharp, specific, and built to convert.",
    },
    {
      tag: "Research",
      title: ["Market", "Analysis"],
      desc: "Decisions without data are guesses. We deliver in-depth competitive research and market positioning reports that reveal where your brand stands — and how to move ahead.",
    },
    {
      tag: "Social & Email",
      title: ["Social &", "Email"],
      desc: "Consistent, human-written social content and email campaigns that build community and drive repeat engagement. No recycled templates, no AI-padded newsletters.",
    },
    {
      tag: "Reputation",
      title: ["Reputation", "& GMB"],
      desc: "Your online reputation shapes every decision a potential customer makes before they ever contact you. We manage your Google Business Profile and review presence so your brand shows up accurately, ranks locally, and builds trust before the first conversation even happens.",
    },
  ];

  const srvPanel = document.getElementById("srv-panel");
  const srvPanelTag = document.getElementById("panel-tag");
  const srvPanelTitle = document.getElementById("panel-title");
  const srvPanelDesc = document.getElementById("panel-desc");
  const srvPanelCount = document.getElementById("panel-count");
  const srvPanelIndex = document.getElementById("panel-index");
  const srvDots = document.querySelectorAll(".srv-prog-dot");
  const srvEntries = document.querySelectorAll(".srv-entry");
  let srvCurrentActive = 0;

  function animateSrvPanelTo(idx) {
    if (idx === srvCurrentActive) return;
    const data = srvServices[idx];
    gsap.to([srvPanelTag, srvPanelTitle, srvPanelDesc], {
      y: -18,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        srvPanelTag.textContent = data.tag;
        srvPanelTitle.innerHTML = data.title
          .map((l) => `<span>${l}</span>`)
          .join("");
        srvPanelDesc.textContent = data.desc;
        srvPanelCount.textContent = String(idx + 1).padStart(2, "0");
        srvPanelIndex.textContent = String(idx + 1).padStart(2, "0");
        srvPanel.setAttribute("data-active", idx);
        gsap.fromTo(
          [srvPanelTag, srvPanelTitle, srvPanelDesc],
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.06,
          },
        );
      },
    });
    srvDots.forEach((d, i) => d.classList.toggle("active", i === idx));
    srvEntries.forEach((e, i) => e.classList.toggle("is-active", i === idx));
    srvCurrentActive = idx;
  }

  srvEntries.forEach((entry, i) => {
    ScrollTrigger.create({
      trigger: entry,
      start: "top 55%",
      end: "bottom 45%",
      onEnter: () => animateSrvPanelTo(i),
      onEnterBack: () => animateSrvPanelTo(i),
    });
  });

  srvEntries.forEach((entry) => {
    gsap.fromTo(
      entry.querySelectorAll(".word span"),
      { y: "105%" },
      {
        y: "0%",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: entry,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
    gsap.fromTo(
      entry.querySelector(".srv-entry-num"),
      { opacity: 0, x: -16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: entry,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  gsap.fromTo(
    ".srv-process-title .tline span",
    { y: "110%" },
    {
      y: "0%",
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.07,
      scrollTrigger: {
        trigger: ".srv-process",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".srv-process-intro",
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power3.out",
      delay: 0.15,
      scrollTrigger: {
        trigger: ".srv-process",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".srv-step",
    { y: 56, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".srv-steps",
        start: "top 84%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".srv-cta-kicker span",
    { y: "110%" },
    {
      y: "0%",
      duration: 0.9,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".srv-cta",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".srv-cta-title .tline span",
    { y: "110%" },
    {
      y: "0%",
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.09,
      delay: 0.1,
      scrollTrigger: {
        trigger: ".srv-cta",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  gsap.fromTo(
    ".srv-cta-actions",
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: "power3.out",
      delay: 0.38,
      scrollTrigger: {
        trigger: ".srv-cta",
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );
}