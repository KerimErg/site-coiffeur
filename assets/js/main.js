/* =====================================================================
   ACE BARBER — "The Ace Experience" · scripts
   --------------------------------------------------------------------
   ⚙️ CONFIGURATION — modifiez uniquement ce bloc.
   ===================================================================== */
const CONFIG = {
  phone: "+33767991719",
  phoneDisplay: "07 67 99 17 19",
  // FRESHA = réservations uniquement
  bookingUrl: "https://www.fresha.com/fr/a/ace-barber-reichstett-33-rue-du-general-leclerc-bswocfue/booking",
  address: "33 Rue du Général Leclerc, 67116 Reichstett",
  businessName: "Ace Barber",
  // GOOGLE = avis uniquement. Lien vers la fiche Google (avis).
  // Idéalement : "https://search.google.com/local/reviews?placeid=VOTRE_PLACE_ID"
  googleReviewsUrl: "",
  instagramUrl: "https://www.instagram.com/ace__barberr/",
};

/* =====================================================================
   Rien à modifier en dessous.
   Chaque fonctionnalité est isolée : une erreur n'interrompt pas le reste,
   et le contenu reste toujours visible même si le JS échoue.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn("[Ace]", e); } }

  /* ---------- Footer partagé des pages légales (injecté avant le câblage) ---------- */
  safe(function () {
    var slot = doc.querySelector("[data-legal-footer]");
    if (!slot) return;
    slot.innerHTML =
      '<div class="wrap foot__grid">' +
        '<div class="foot__brand"><img class="foot__logo" data-foot-logo src="assets/img/logo.jpg" alt="Ace Barber" width="52" height="52" /><span class="brand__mark foot__mark">A</span>' +
          '<div><div class="foot__name">ACE BARBER</div><div class="foot__tag">Barbier — Reichstett</div></div>' +
          '<a class="foot__ig" href="' + CONFIG.instagramUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram d\'Ace Barber (nouvel onglet)">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg><span>@ace__barberr</span></a>' +
        '</div>' +
        '<div class="foot__col"><h4>Contact</h4>' +
          '<a data-maps-link href="#" target="_blank" rel="noopener noreferrer">33 Rue du Général Leclerc, 67116 Reichstett</a>' +
          '<a data-phone-link href="#">07 67 99 17 19</a>' +
          '<span>Mardi – Samedi · 10:00 – 19:00</span></div>' +
        '<div class="foot__col"><h4>Réserver &amp; suivre</h4>' +
          '<a data-booking-link href="#" target="_blank" rel="noopener">Prendre rendez-vous (Fresha)</a>' +
          '<a data-google-reviews-link href="#" target="_blank" rel="noopener noreferrer">Avis Google</a>' +
          '<a href="' + CONFIG.instagramUrl + '" target="_blank" rel="noopener noreferrer">Instagram</a></div>' +
        '<div class="foot__col"><h4>Informations</h4>' +
          '<a href="mentions-legales.html">Mentions légales</a>' +
          '<a href="confidentialite.html">Politique de confidentialité</a>' +
          '<a href="cookies.html">Politique de cookies</a></div>' +
      '</div>' +
      '<div class="wrap foot__bottom"><span>© <span data-year>2026</span> Ace Barber. Tous droits réservés.</span>' +
      '<span class="foot__ace">A · C · E</span></div>';
  });

  /* ---------- Liens dynamiques ---------- */
  safe(function () {
    var maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.address);
    var reviews = CONFIG.googleReviewsUrl ||
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.businessName + " " + CONFIG.address);
    doc.querySelectorAll("[data-phone-link]").forEach(function (el) { el.href = "tel:" + CONFIG.phone; });
    doc.querySelectorAll("[data-booking-link]").forEach(function (el) { el.href = CONFIG.bookingUrl; });
    doc.querySelectorAll("[data-maps-link]").forEach(function (el) { el.href = maps; });
    doc.querySelectorAll("[data-google-reviews-link]").forEach(function (el) { el.href = reviews; });
    var y = doc.querySelector("[data-year]"); if (y) y.textContent = String(new Date().getFullYear());
  });

  /* ---------- Avis Google (note + nombre) depuis un JSON servi en local ----------
     Les données sont récupérées côté serveur (GitHub Action + API Places) et
     écrites dans assets/data/google-reviews.json. Le navigateur ne fait qu'une
     requête MÊME ORIGINE : aucune clé API, aucun service tiers, aucun cookie.
     En cas d'échec, les valeurs statiques du HTML sont conservées. */
  safe(function () {
    if (!("fetch" in window)) return;
    fetch("assets/data/google-reviews.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        var rating = Number(d.rating), count = Number(d.reviewCount);
        if (Number.isFinite(rating) && rating > 0 && rating <= 5) {
          var txt = rating.toFixed(1).replace(".", ",");
          doc.querySelectorAll("[data-google-rating]").forEach(function (el) { el.textContent = txt; });
        }
        if (Number.isFinite(count) && count >= 0) {
          doc.querySelectorAll("[data-google-count]").forEach(function (el) { el.textContent = String(Math.round(count)); });
        }
        var upd = doc.querySelector("[data-google-updated]");
        if (upd && d.source === "google-places" && d.lastUpdated) {
          var dt = new Date(d.lastUpdated);
          if (!isNaN(dt)) {
            upd.textContent = "Note et avis synchronisés depuis Google le " +
              dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) + ".";
            upd.hidden = false;
          }
        }
      })
      .catch(function () { /* on garde les valeurs statiques */ });
  });

  /* ---------- Services : clic = réservation ---------- */
  safe(function () {
    doc.querySelectorAll(".menu-line[data-booking]").forEach(function (el) {
      el.addEventListener("click", function () { window.open(CONFIG.bookingUrl, "_blank", "noopener"); });
    });
  });

  /* ---------- WebP : n'utiliser les <source> WebP que si le fichier existe ---------- */
  safe(function () {
    doc.querySelectorAll("source[data-srcset]").forEach(function (src) {
      var url = src.getAttribute("data-srcset");
      var probe = new Image();
      probe.onload = function () { if (probe.naturalWidth > 0) src.srcset = url; };
      probe.src = url; // si 404, onload ne se déclenche pas -> on garde le JPEG
    });
  });

  /* ---------- Micro-intro : nettoyage après l'animation ---------- */
  safe(function () {
    var intro = doc.querySelector("[data-intro]");
    if (!intro) return;
    if (reduce) { intro.classList.add("is-done"); return; }
    var kill = function () { intro.classList.add("is-done"); };
    intro.addEventListener("animationend", function (e) { if (e.animationName === "introOut") kill(); });
    setTimeout(kill, 2200); // filet de sécurité
  });

  /* ---------- REVEAL (mis en place en premier) ---------- */
  safe(function () {
    var items = doc.querySelectorAll(".reveal, .reveal-word");
    if (!items.length || !("IntersectionObserver" in window)) return;
    root.classList.add("reveal-ready");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // stagger sur les mots d'un même parent
        if (el.classList.contains("reveal-word")) {
          var sibs = Array.prototype.slice.call(el.parentNode.querySelectorAll(".reveal-word"));
          var i = sibs.indexOf(el);
          el.style.transitionDelay = (i * 0.06) + "s";
        }
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add("is-in"); }); }, 3500);
  });

  /* ---------- Nav : état scrolled ---------- */
  safe(function () {
    var nav = doc.querySelector("[data-nav]");
    if (!nav) return;
    var on = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
    on(); window.addEventListener("scroll", on, { passive: true });
  });

  /* ---------- Menu mobile ---------- */
  safe(function () {
    var toggle = doc.querySelector("[data-menu-toggle]"), menu = doc.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;
    var set = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menu.hidden = !open; doc.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", function () { set(menu.hidden); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    var mq = window.matchMedia("(min-width: 861px)");
    var onCh = function (e) { if (e.matches) set(false); };
    if (mq.addEventListener) mq.addEventListener("change", onCh); else if (mq.addListener) mq.addListener(onCh);
  });

  /* ---------- Parallaxe : photo dans le mot ACE (desktop uniquement) ---------- */
  safe(function () {
    if (reduce || !finePointer) return;
    var ace = doc.querySelector("[data-hero-photo]");
    var placeImg = doc.querySelector(".place__media img");
    if (!ace && !placeImg) return;
    var ticking = false;
    var run = function () {
      var y = window.scrollY;
      if (ace) {
        // déplace lentement la photo à l'intérieur des lettres (parallaxe subtile)
        var p = 34 + Math.min(y, window.innerHeight) * 0.014;
        ace.style.backgroundPosition = "center, center " + p + "%";
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true; window.requestAnimationFrame(run);
    }, { passive: true });
    run();
  });

  /* ---------- Jour d'ouverture en surbrillance ---------- */
  safe(function () {
    var hours = doc.querySelector("[data-hours]"); if (!hours) return;
    var idx = (new Date().getDay() + 6) % 7; // lundi=0 … dimanche=6
    var rows = hours.querySelectorAll("tbody tr");
    if (rows[idx]) rows[idx].classList.add("is-today");
  });

  /* ---------- Dock mobile : apparaît après le hero ---------- */
  safe(function () {
    var dock = doc.querySelector("[data-dock]"), hero = doc.querySelector(".hero");
    if (!dock || !hero || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { dock.classList.toggle("is-visible", !e.isIntersecting); });
    }, { threshold: 0.15 }).observe(hero);
  });

  /* ---------- Curseur personnalisé (desktop, pointeur fin) ---------- */
  safe(function () {
    if (!finePointer || reduce) return;
    var cur = doc.querySelector("[data-cursor]"); if (!cur) return;
    doc.body.classList.add("has-cursor");
    var x = -100, y = -100, cx = x, cy = y, active = false;
    window.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      if (!active) { active = true; cur.classList.add("is-active"); }
    }, { passive: true });
    window.addEventListener("mouseleave", function () { active = false; cur.classList.remove("is-active"); });
    var hoverSel = "a, button, .menu-line, [data-booking]";
    doc.addEventListener("mouseover", function (e) { if (e.target.closest(hoverSel)) cur.classList.add("is-hover"); });
    doc.addEventListener("mouseout", function (e) { if (e.target.closest(hoverSel)) cur.classList.remove("is-hover"); });
    (function loop() {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      window.requestAnimationFrame(loop);
    })();
  });

  /* ---------- Nav : surbrillance de la section courante (scroll-spy) ---------- */
  safe(function () {
    if (!("IntersectionObserver" in window)) return;
    var links = {};
    doc.querySelectorAll('.nav__links a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var ids = Object.keys(links);
    if (!ids.length) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        ids.forEach(function (k) { links[k].classList.toggle("is-current", k === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    ids.forEach(function (id) { var s = doc.getElementById(id); if (s) spy.observe(s); });
  });

  /* ---------- Smooth scroll ancres + back-to-top ---------- */
  safe(function () {
    doc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var t = doc.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
  });

  /* ---------- Logo : afficher le vrai logo dès que assets/img/logo.png existe ----------
     Si le fichier est présent et se charge, on remplace le monogramme par le logo.
     Sinon (fichier absent), on conserve le monogramme « A / ACE BARBER ». */
  safe(function () {
    doc.querySelectorAll("[data-brand-logo]").forEach(function (img) {
      var brand = img.closest(".brand");
      if (!brand) return;
      var ok = function () { if (img.naturalWidth > 0) brand.classList.add("brand--has-logo"); };
      if (img.complete) ok();
      img.addEventListener("load", ok);
    });
    doc.querySelectorAll("[data-foot-logo]").forEach(function (img) {
      var brand = img.closest(".foot__brand");
      if (!brand) return;
      var ok = function () { if (img.naturalWidth > 0) brand.classList.add("has-logo"); };
      if (img.complete) ok();
      img.addEventListener("load", ok);
    });
  });

  /* Carte : OpenStreetMap, affichée directement (aucun cookie -> aucun consentement requis). */
})();
