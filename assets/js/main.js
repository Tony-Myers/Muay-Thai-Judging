(function () {
  const nav = document.querySelector(".nav");
  const btn = document.querySelector(".nav-toggle");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
    });
  }

  // Mark current link for accessibility
  const here = location.pathname.replace(/\/$/, "");
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    const target = href.replace(/\/$/, "");
    if (target && (target === here || (target === "" && here === ""))) {
      a.setAttribute("aria-current", "page");
    }
  });
})();
