/* =====================================================================
   ACE BARBER — Scripts
   --------------------------------------------------------------------
   ⚙️  CONFIGURATION — modifiez uniquement le bloc ci-dessous.
   ===================================================================== */

const CONFIG = {
  // Téléphone (format international pour l'appel, format lisible pour l'affichage)
  phone: "+33767991719",
  phoneDisplay: "07 67 99 17 19",

  /* -----------------------------------------------------------------
     LIEN DE RÉSERVATION
     -----------------------------------------------------------------
     ⚠️  L'URL exacte de la fiche Fresha d'Ace Barber n'a pas pu être
     vérifiée automatiquement. Par sécurité, aucun lien n'a été inventé.

     👉 Remplacez la valeur ci-dessous par l'URL EXACTE de votre page de
        réservation Fresha (elle ressemble à :
        https://www.fresha.com/a/ace-barber-....-xxxxxxxx/booking).

     Tant que cette valeur reste le lien générique Fresha, le bouton
     « Prendre rendez-vous » ouvrira la recherche Fresha.
  ----------------------------------------------------------------- */
  bookingUrl: "https://www.fresha.com/",

  // Adresse (utilisée pour le lien Google Maps)
  address: "33 Rue du Général Leclerc, 67116 Reichstett",
};

/* =====================================================================
   Rien à modifier en dessous de cette ligne.
   ===================================================================== */
(function () {
  "use strict";

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CONFIG.address);

  /* ---------- Injection des liens dynamiques ---------- */
  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    el.setAttribute("href", "tel:" + CONFIG.phone);
  });
  document.querySelectorAll("[data-phone-display]").forEach((el) => {
    el.textContent = CONFIG.phoneDisplay;
  });
  document.querySelectorAll("[data-booking-link]").forEach((el) => {
    el.setAttribute("href", CONFIG.bookingUrl);
  });
  document.querySelectorAll("[data-maps-link]").forEach((el) => {
    el.setAttribute("href", mapsUrl);
  });

  /* ---------- Année du footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    // Année fixe injectée par le HTML ; on tente une mise à jour dynamique.
    try {
      yearEl.textContent = new Date().getFullYear();
    } catch (e) {
      /* garde la valeur du HTML */
    }
  }

  /* ---------- Nav : état "scrolled" ---------- */
  const nav = document.querySelector("[data-nav]");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    // Referme le menu si on repasse en desktop
    window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Parallaxe légère du hero ---------- */
  const heroImg = document.querySelector(".hero__img");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroImg && !reduceMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, window.innerHeight);
          heroImg.style.transform = "translateY(" + y * 0.15 + "px)";
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Mise en avant du jour d'ouverture ---------- */
  const hours = document.querySelector("[data-hours]");
  if (hours) {
    try {
      // getDay() : 0 = dimanche ... 6 = samedi -> ligne du tableau (lundi = 1re ligne)
      const jsDay = new Date().getDay();
      const rowIndex = (jsDay + 6) % 7; // lundi=0 ... dimanche=6
      const rows = hours.querySelectorAll("tbody tr");
      if (rows[rowIndex]) rows[rowIndex].classList.add("is-today");
    } catch (e) {
      /* pas critique */
    }
  }

  /* ---------- Barre d'action mobile : apparaît après le hero ---------- */
  const actionBar = document.querySelector("[data-action-bar]");
  const hero = document.querySelector(".hero");
  if (actionBar && hero && "IntersectionObserver" in window) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          actionBar.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    barObserver.observe(hero);
  }
})();
