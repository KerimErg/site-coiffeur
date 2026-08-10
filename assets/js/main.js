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
   --------------------------------------------------------------------
   Chaque fonctionnalité est isolée dans son propre try/catch : si l'une
   échoue (navigateur ancien, API manquante…), les autres continuent de
   fonctionner et la page reste toujours affichée.
   ===================================================================== */
(function () {
  "use strict";

  // Petit utilitaire : exécute une fonction sans jamais laisser une erreur
  // interrompre le reste du script.
  function safe(fn) {
    try {
      fn();
    } catch (e) {
      if (window.console && console.warn) console.warn("[Ace Barber]", e);
    }
  }

  /* ---------- REVEAL ON SCROLL (mis en place en premier) ----------
     On n'active l'animation (qui masque le contenu au départ) QUE si
     IntersectionObserver est disponible. Sinon, le contenu reste visible. */
  safe(function () {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      // Pas de support : on ne masque rien, tout reste visible.
      return;
    }

    // On indique au CSS qu'il peut masquer puis animer les éléments.
    document.documentElement.classList.add("reveal-ready");

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });

    // Filet de sécurité : si pour une raison quelconque l'observer ne
    // déclenche pas (ex. onglet en arrière-plan), on révèle tout après 3s.
    setTimeout(function () {
      reveals.forEach(function (el) {
        el.classList.add("is-in");
      });
    }, 3000);
  });

  /* ---------- Injection des liens dynamiques ---------- */
  safe(function () {
    var mapsUrl =
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(CONFIG.address);

    document.querySelectorAll("[data-phone-link]").forEach(function (el) {
      el.setAttribute("href", "tel:" + CONFIG.phone);
    });
    document.querySelectorAll("[data-phone-display]").forEach(function (el) {
      el.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll("[data-booking-link]").forEach(function (el) {
      el.setAttribute("href", CONFIG.bookingUrl);
    });
    document.querySelectorAll("[data-maps-link]").forEach(function (el) {
      el.setAttribute("href", mapsUrl);
    });
  });

  /* ---------- Année du footer ---------- */
  safe(function () {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });

  /* ---------- Nav : état "scrolled" ---------- */
  safe(function () {
    var nav = document.querySelector("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  });

  /* ---------- Menu mobile ---------- */
  safe(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menu.hidden = !open;
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenu(false);
      });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    // Referme le menu si on repasse en desktop.
    // addEventListener sur MediaQueryList n'existe pas sur d'anciens
    // navigateurs -> on protège l'appel (utilise addListener en secours).
    var mq = window.matchMedia("(min-width: 981px)");
    var onChange = function (e) {
      if (e.matches) setMenu(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  });

  /* ---------- Parallaxe légère du hero ---------- */
  safe(function () {
    var heroImg = document.querySelector(".hero__img");
    if (!heroImg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          var y = Math.min(window.scrollY, window.innerHeight);
          heroImg.style.transform = "translateY(" + y * 0.15 + "px)";
          ticking = false;
        });
      },
      { passive: true }
    );
  });

  /* ---------- Mise en avant du jour d'ouverture ---------- */
  safe(function () {
    var hours = document.querySelector("[data-hours]");
    if (!hours) return;
    // getDay() : 0 = dimanche ... 6 = samedi -> ligne (lundi = 1re ligne)
    var jsDay = new Date().getDay();
    var rowIndex = (jsDay + 6) % 7; // lundi=0 ... dimanche=6
    var rows = hours.querySelectorAll("tbody tr");
    if (rows[rowIndex]) rows[rowIndex].classList.add("is-today");
  });

  /* ---------- Barre d'action mobile : apparaît après le hero ---------- */
  safe(function () {
    var actionBar = document.querySelector("[data-action-bar]");
    var hero = document.querySelector(".hero");
    if (!actionBar || !hero || !("IntersectionObserver" in window)) return;

    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          actionBar.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    barObserver.observe(hero);
  });
})();
