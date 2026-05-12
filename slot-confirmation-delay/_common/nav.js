/* ─────────────────────────────────────────────────────────────
   Wiom CSP Prototype — Navigation helper
   Wires click → next-screen transitions. Inert taps are no-ops.
   ────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // Find every element with [data-goto] and wire click → navigation.
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

    // [data-inert] = visually a button/tap target but a no-op (not in this flow)
    (root || document)
      .querySelectorAll("[data-inert]")
      .forEach(function (el) {
        if (el.__inertWired) return;
        el.__inertWired = true;
        el.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      });

    // Toggling (used for archive collapse)
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

  // Auto-show a sheet (?sheet=name) — used so a screen can land directly on
  // the reassurance sheet by linking to ...html?sheet=reassurance.
  function autoShowSheet() {
    var params = new URLSearchParams(window.location.search);
    var sheet = params.get("sheet");
    if (!sheet) return;
    var el = document.querySelector(
      "[data-sheet='" + sheet + "']"
    );
    if (el) el.style.display = "";
  }

  // Auto-open dropdown (?menu=open)
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
  });

  // Expose for screens that build DOM dynamically
  window.WiomNav = { wireNav: wireNav };
})();
