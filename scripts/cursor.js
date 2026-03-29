

(function () {
  "use strict";

  /* ── 1. SKIP ON TOUCH / REDUCED MOTION ──────────────────── */
  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (isTouchDevice || prefersReducedMotion) return;

  /* ── 2. CONFIG ────────────────────────────────────────────
     Tweak these to change the feel without touching the logic.
  ─────────────────────────────────────────────────────────── */
  const CONFIG = {
    /* Colors */
    colorDot:       "#FF3E9B",   // idle dot fill
    colorDotHover:  "#66D0BC",   // dot fill on hover
    colorDotClick:  "#FF88BA",   // dot fill on click
    colorRing:      "rgba(255, 62, 155, 0.55)",
    colorRingHover: "rgba(102, 208, 188, 0.65)",
    colorRingClick: "rgba(255, 136, 186, 0.9)",

    /* Dot */
    dotSize:        8,
    dotSizeHover:   6,
    dotSizeClick:   4,

    /* Ring */
    ringSizeidle:   36,
    ringSizeHover:  54,
    ringSizeClick:  18,
    ringBorder:     1.5,
    ringBorderClick:2,

    /* Spring physics for the ring (0 < value < 1)
       Lower = more lag / dreamier. Higher = snappier. */
    springStrength: 0.12,

    /* Trail */
    trailCount:     12,          // number of trail particles
    trailSpeed:     0.38,        // how quickly each chases the previous
    trailColors:    ["#FF3E9B", "#FF88BA", "#66D0BC"], // cycles through
    trailOpacity:   0.45,        // max opacity of first particle

    /* Glow (box-shadow on dot) */
    glowIdle:   "0 0 10px rgba(255, 62, 155, 0.7)",
    glowHover:  "0 0 14px rgba(102, 208, 188, 0.85)",
    glowClick:  "0 0 8px rgba(255, 136, 186, 0.9)",

    /* CSS class added to <body> when cursor is active —
       use this to hide the native cursor in your CSS. */
    bodyClass:      "custom-cursor-active",

    /* Selectors that trigger hover state */
    hoverSelectors:
      "a, button, [role='button'], label[for], select, " +
      ".hoverable, .nav-cta, .btn-primary, .btn-ghost, " +
      ".btn-submit, .filter-tab, .tech-tag, .project-card, " +
      ".contact-link, .p-link, #theme-toggle, #fero-launcher, " +
      ".vtab, .fero-chip",
  };

  /* ── 3. INJECT GLOBAL STYLE ──────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    /* Hide native cursor when JS cursor is active */
    .${CONFIG.bodyClass},
    .${CONFIG.bodyClass} * {
      cursor: none !important;
    }

    /* Cursor elements */
    #fc-dot, #fc-ring {
      position: fixed;
      top: 0; left: 0;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483647; /* max z-index */
      will-change: transform;
      backface-visibility: hidden;
    }
    #fc-dot {
      transform: translate(-50%, -50%);
      transition:
        width  0.15s ease,
        height 0.15s ease,
        background 0.2s ease,
        box-shadow 0.2s ease,
        opacity 0.3s ease;
    }
    #fc-ring {
      border-style: solid;
      transform: translate(-50%, -50%);
      transition:
        width  0.28s cubic-bezier(0.16, 1, 0.3, 1),
        height 0.28s cubic-bezier(0.16, 1, 0.3, 1),
        border-color 0.25s ease,
        border-width 0.15s ease,
        opacity 0.3s ease;
    }
    #fc-trail {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483646;
      overflow: hidden;
    }
    .fc-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      will-change: transform;
      transform: translate(-50%, -50%);
    }
  `;
  document.head.appendChild(style);

  /* ── 4. BUILD DOM ─────────────────────────────────────────── */
  const dot = document.createElement("div");
  dot.id = "fc-dot";

  const ring = document.createElement("div");
  ring.id = "fc-ring";

  const trailContainer = document.createElement("div");
  trailContainer.id = "fc-trail";

  // Trail particles
  const particles = [];
  const positions  = []; // stores {x, y} per particle

  for (let i = 0; i < CONFIG.trailCount; i++) {
    const ratio  = 1 - i / CONFIG.trailCount;
    const size   = Math.max(2, ratio * 5);
    const color  = CONFIG.trailColors[i % CONFIG.trailColors.length];
    const el     = document.createElement("div");
    el.className = "fc-particle";
    el.style.cssText = `
      width:   ${size}px;
      height:  ${size}px;
      background: ${color};
      opacity: ${ratio * CONFIG.trailOpacity};
    `;
    trailContainer.appendChild(el);
    particles.push(el);
    positions.push({ x: -200, y: -200 });
  }

  document.body.appendChild(trailContainer);
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.body.classList.add(CONFIG.bodyClass);

  /* ── 5. APPLY INITIAL STYLES ─────────────────────────────── */
  function applyDotIdle() {
    dot.style.width      = CONFIG.dotSize + "px";
    dot.style.height     = CONFIG.dotSize + "px";
    dot.style.background = CONFIG.colorDot;
    dot.style.boxShadow  = CONFIG.glowIdle;
  }
  function applyDotHover() {
    dot.style.width      = CONFIG.dotSizeHover + "px";
    dot.style.height     = CONFIG.dotSizeHover + "px";
    dot.style.background = CONFIG.colorDotHover;
    dot.style.boxShadow  = CONFIG.glowHover;
  }
  function applyDotClick() {
    dot.style.width      = CONFIG.dotSizeClick + "px";
    dot.style.height     = CONFIG.dotSizeClick + "px";
    dot.style.background = CONFIG.colorDotClick;
    dot.style.boxShadow  = CONFIG.glowClick;
  }

  function applyRingIdle() {
    ring.style.width       = CONFIG.ringSizeidle + "px";
    ring.style.height      = CONFIG.ringSizeidle + "px";
    ring.style.borderColor = CONFIG.colorRing;
    ring.style.borderWidth = CONFIG.ringBorder + "px";
  }
  function applyRingHover() {
    ring.style.width       = CONFIG.ringSizeHover + "px";
    ring.style.height      = CONFIG.ringSizeHover + "px";
    ring.style.borderColor = CONFIG.colorRingHover;
    ring.style.borderWidth = CONFIG.ringBorder + "px";
  }
  function applyRingClick() {
    ring.style.width       = CONFIG.ringSizeClick + "px";
    ring.style.height      = CONFIG.ringSizeClick + "px";
    ring.style.borderColor = CONFIG.colorRingClick;
    ring.style.borderWidth = CONFIG.ringBorderClick + "px";
  }

  applyDotIdle();
  applyRingIdle();

  /* ── 6. STATE ─────────────────────────────────────────────── */
  let mx = -200, my = -200; // raw mouse position
  let rx = -200, ry = -200; // ring interpolated position
  let isHovering = false;
  let isClicking = false;
  let isVisible  = false;

  /* ── 7. MOUSE EVENTS ──────────────────────────────────────── */
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;

    // Snap dot to exact position
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";

    // Show on first move
    if (!isVisible) {
      isVisible = true;
      dot.style.opacity  = "1";
      ring.style.opacity = "1";
    }
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity  = "0";
    ring.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    if (isVisible) {
      dot.style.opacity  = "1";
      ring.style.opacity = "1";
    }
  });

  /* Hover detection — attach to existing + future elements */
  function attachHoverListeners(root = document) {
    root.querySelectorAll(CONFIG.hoverSelectors).forEach((el) => {
      if (el._fcAttached) return;
      el._fcAttached = true;

      el.addEventListener("mouseenter", () => {
        isHovering = true;
        if (!isClicking) { applyDotHover(); applyRingHover(); }
      });
      el.addEventListener("mouseleave", () => {
        isHovering = false;
        if (!isClicking) { applyDotIdle(); applyRingIdle(); }
      });
    });
  }
  attachHoverListeners();

  // Re-attach when DOM changes (e.g. chat widget loads)
  const mutObs = new MutationObserver(() => attachHoverListeners());
  mutObs.observe(document.body, { childList: true, subtree: true });

  /* Click */
  document.addEventListener("mousedown", () => {
    isClicking = true;
    applyDotClick();
    applyRingClick();

    // Ripple burst on click
    spawnClickRipple(mx, my);
  });

  document.addEventListener("mouseup", () => {
    isClicking = false;
    if (isHovering) { applyDotHover(); applyRingHover(); }
    else            { applyDotIdle();  applyRingIdle();  }
  });

  /* ── 8. CLICK RIPPLE ─────────────────────────────────────── */
  function spawnClickRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top:  ${y}px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      border: 1.5px solid ${CONFIG.colorDot};
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
      pointer-events: none;
      z-index: 2147483645;
      transition: transform 0.5s ease-out, opacity 0.5s ease-out;
    `;
    document.body.appendChild(ripple);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(6)";
        ripple.style.opacity   = "0";
      });
    });

    setTimeout(() => ripple.remove(), 550);
  }

  /* ── 9. ANIMATION LOOP ───────────────────────────────────────
     Single rAF loop handles:
     - Ring spring interpolation
     - Trail particle chasing
     All in one frame — no extra timers.
  ─────────────────────────────────────────────────────────── */
  function loop() {
    // Spring: ring chases mouse with lag
    rx += (mx - rx) * CONFIG.springStrength;
    ry += (my - ry) * CONFIG.springStrength;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";

    // Trail: each particle chases the one before it
    positions[0].x = mx;
    positions[0].y = my;

    for (let i = 1; i < CONFIG.trailCount; i++) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * CONFIG.trailSpeed;
      positions[i].y += (positions[i - 1].y - positions[i].y) * CONFIG.trailSpeed;
    }

    for (let i = 0; i < CONFIG.trailCount; i++) {
      particles[i].style.left = positions[i].x + "px";
      particles[i].style.top  = positions[i].y + "px";
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);



})();
