/* ─────────────────────────────────────────────────────────────
   Wiom CSP Prototype — Navigation helper
   - Wires click → next-screen transitions for [data-goto]
   - Toggles open/close state for [data-toggle]
   - Inert taps are no-ops but still bubble to document
   - Renders a desktop-only sidebar listing every screen
   - Pulses interactive elements when a non-interactive area is tapped
   ────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // 1. Click wiring (existing behaviour)
  // ─────────────────────────────────────────────
  function wireNav(root) {
    (root || document)
      .querySelectorAll("[data-goto]")
      .forEach(function (el) {
        if (el.__navWired) return;
        el.__navWired = true;
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var href = el.getAttribute("data-goto");
          if (!href) return;
          window.location.href = href;
        });
      });

    (root || document)
      .querySelectorAll("[data-inert]")
      .forEach(function (el) {
        if (el.__inertWired) return;
        el.__inertWired = true;
        el.addEventListener("click", function (e) {
          e.preventDefault();
          // No stopPropagation — let document-level hint handler fire
        });
      });

    (root || document)
      .querySelectorAll("[data-toggle]")
      .forEach(function (el) {
        if (el.__toggleWired) return;
        el.__toggleWired = true;
        el.addEventListener("click", function (e) {
          var targetSel = el.getAttribute("data-toggle");
          var target = targetSel
            ? document.querySelector(targetSel)
            : el.parentElement;
          if (target) target.classList.toggle("is-open");
        });
      });
  }

  // ─────────────────────────────────────────────
  // 2. Flow navigator sidebar (desktop only)
  // ─────────────────────────────────────────────
  var SCREENS = [
    {
      label: "Intro",
      items: [
        { key: "index", name: "Cover · Problem statement", type: "yellow" },
        { key: "context/idx", name: "Pick a flow", type: "yellow" }
      ]
    },
    {
      label: "Flow 1 — Customer responds",
      items: [
        { key: "context/f1-yc1", name: "Setup · 12 May evening", type: "yellow" },
        { key: "flow1/f1-1", name: "Home · active feed", type: "app" },
        { key: "flow1/f1-2", name: "Drilldown · awaiting customer", type: "app" },
        { key: "context/f1-yc2", name: "Story · a day passed", type: "yellow" },
        { key: "flow1/f1-3", name: "Home · archive bar", type: "app" },
        { key: "flow1/f1-4", name: "Home · archive expanded", type: "app" },
        { key: "flow1/f1-5", name: "Drilldown · in archive", type: "app" },
        { key: "context/f1-yc3", name: "Story · customer responded", type: "yellow" },
        { key: "flow1/f1-6", name: "Lockscreen · push notification", type: "app" },
        { key: "flow1/f1-7", name: "Home · slot confirmed", type: "app" },
        { key: "flow1/f1-8", name: "Drilldown · slot confirmed", type: "app" },
        { key: "flow1/f1-end", name: "Flow 1 recap", type: "yellow" }
      ]
    },
    {
      label: "Flow 2 — Customer doesn't respond",
      items: [
        { key: "context/f2-yc1", name: "Setup · 3 days passed", type: "yellow" },
        { key: "flow2/f2-1", name: "Home · archive (day 3)", type: "app" },
        { key: "flow2/f2-2", name: "Drilldown · final try", type: "app" },
        { key: "context/f2-yc2", name: "Story · booking removed", type: "yellow" },
        { key: "flow2/f2-3", name: "Lockscreen · booking removed", type: "app" },
        { key: "flow2/f2-4", name: "Home · card removed", type: "app" },
        { key: "flow2/f2-end", name: "Flow 2 recap", type: "yellow" }
      ]
    },
    {
      label: "Flow 3 — Partner cancel attempt",
      items: [
        { key: "context/f3-yc1", name: "Setup · partner wants to cancel", type: "yellow" },
        { key: "flow3/f3-1", name: "Home · archive", type: "app" },
        { key: "flow3/f3-2", name: "Drilldown · kebab visible", type: "app" },
        { key: "flow3/f3-3", name: "Drilldown · kebab open", type: "app" },
        { key: "flow3/f3-4", name: "Reassurance bottom sheet", type: "app" },
        { key: "flow3/f3-5a", name: "Drilldown · sheet closed", type: "app" },
        { key: "flow3/f3-5b", name: "Exit reason sheet", type: "app" },
        { key: "flow3/f3-end", name: "Flow 3 recap", type: "yellow" }
      ]
    }
  ];

  function getCurrentKey() {
    var path = window.location.pathname.replace(/\.html$/, "");
    // Trailing slash means we're at the prototype root → cover
    if (/\/$/.test(path)) return "index";

    // Last 2 segments form the key (e.g. "flow1/f1-2", "context/c1", "index")
    var parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "index";

    var last = parts[parts.length - 1];
    var second = parts[parts.length - 2];

    // index.html at prototype root
    if (last === "index") return "index";

    // Subfolder file → e.g. context/c1 or flow1/f1-2
    if (second === "context" || second === "flow1" || second === "flow2" || second === "flow3") {
      return second + "/" + last;
    }

    return last;
  }

  function isInSubfolder() {
    return /\/(context|flow1|flow2|flow3)\//.test(window.location.pathname);
  }

  function keyToHref(key) {
    var prefix = isInSubfolder() ? "../" : "";
    return prefix + key + ".html";
  }

  function renderSidebar() {
    if (document.querySelector(".flow-nav")) return;
    var currentKey = getCurrentKey();
    var nav = document.createElement("nav");
    nav.className = "flow-nav";

    var header = document.createElement("div");
    header.className = "flow-nav__header";
    header.innerHTML =
      '<div class="flow-nav__title">Slot Confirmation Delay</div>' +
      '<div class="flow-nav__subtitle">Tap any screen to jump</div>';
    nav.appendChild(header);

    SCREENS.forEach(function (section) {
      var sec = document.createElement("div");
      sec.className = "flow-nav__section";

      var sLabel = document.createElement("div");
      sLabel.className = "flow-nav__section-label";
      sLabel.textContent = section.label;
      sec.appendChild(sLabel);

      section.items.forEach(function (item) {
        var a = document.createElement("a");
        a.className =
          "flow-nav__item" + (item.key === currentKey ? " is-current" : "");
        a.href = keyToHref(item.key);

        var dot = document.createElement("span");
        dot.className = "flow-nav__dot flow-nav__dot--" + item.type;
        a.appendChild(dot);

        var label = document.createElement("span");
        label.className = "flow-nav__label";
        label.textContent = item.name;
        a.appendChild(label);

        sec.appendChild(a);
      });

      nav.appendChild(sec);
    });

    document.body.insertBefore(nav, document.body.firstChild);
  }

  // ─────────────────────────────────────────────
  // 3. Hint animation — show users where to tap
  //    (Figma-style hotspot pulse on wrong taps)
  // ─────────────────────────────────────────────
  function setupHintAnimation() {
    document.addEventListener("click", function (e) {
      // Ignore taps inside the sidebar or on interactive elements
      if (e.target.closest(".flow-nav, [data-goto], [data-toggle]")) return;

      // Pulse every interactive element inside the phone frame
      var interactives = document.querySelectorAll(
        ".phone-bezel [data-goto], .phone-bezel [data-toggle]"
      );
      interactives.forEach(function (el) {
        // Restart animation by removing + re-adding the class
        el.classList.remove("is-hinting");
        // Force reflow so the animation re-plays
        void el.offsetWidth;
        el.classList.add("is-hinting");
      });
    });
  }

  // ─────────────────────────────────────────────
  // 4. Existing one-shot helpers
  // ─────────────────────────────────────────────
  function autoShowSheet() {
    var params = new URLSearchParams(window.location.search);
    var sheet = params.get("sheet");
    if (!sheet) return;
    var el = document.querySelector("[data-sheet='" + sheet + "']");
    if (el) el.style.display = "";
  }

  function autoOpenMenu() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("menu") !== "open") return;
    var el = document.querySelector("[data-dropdown]");
    if (el) el.style.display = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireNav();
    autoShowSheet();
    autoOpenMenu();
    renderSidebar();
    setupHintAnimation();
  });

  window.WiomNav = { wireNav: wireNav };
})();
