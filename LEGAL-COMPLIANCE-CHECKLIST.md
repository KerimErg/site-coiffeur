# Ace Barber — Checklist conformité (RGPD / cookies / légal / sécurité)

> ⚠️ La création de ces pages ne rend PAS le site automatiquement conforme.
> Les points ⚠️ ci-dessous doivent être vérifiés/complétés par le propriétaire
> **avant la mise en ligne**, sous sa responsabilité (idéalement avec un conseil juridique).

---

## ✅ ÉLÉMENTS MIS EN PLACE

### Instagram
- [x] Lien vers le compte officiel `https://www.instagram.com/ace__barberr/`.
- [x] Icône dans le header (desktop) + dans le menu mobile + dans le footer.
- [x] `target="_blank"` + `rel="noopener noreferrer"` sur tous les liens Instagram.
- [x] Aucun feed embarqué (pas de script tiers) — simple lien, comme demandé.

### Avis Google (dynamiques, sécurisés)
- [x] Architecture sans clé exposée : GitHub Action planifiée (`.github/workflows/google-reviews.yml`)
      → script `scripts/fetch-google-reviews.mjs` → écrit `assets/data/google-reviews.json`.
- [x] Le frontend lit uniquement ce JSON (même origine) : **aucune clé API, aucun appel tiers, aucun cookie** côté navigateur.
- [x] Récupère la **note** et le **nombre total d'avis** (champs `rating`, `user_ratings_total`).
- [x] Cache raisonnable : synchro quotidienne (cron) + déclenchement manuel possible.
- [x] Gestion d'erreur : si l'API échoue / clé absente, la **dernière valeur valide est conservée** (le fichier n'est pas écrasé).
- [x] Bouton **« Voir tous nos avis Google »** vers la fiche Google.
- [x] Pas de commentaires individuels affichés (respecte les limites de l'API — non contourné).

### Fresha (réservations uniquement)
- [x] Tous les boutons « Prendre rendez-vous » pointent vers la page Fresha officielle
      (`CONFIG.bookingUrl`) — header, hero, services, section salon, CTA final, footer, dock mobile, menu mobile.
- [x] Séparation stricte : **Google = avis**, **Fresha = réservations**.

### RGPD / cookies
- [x] Audit réalisé : après auto-hébergement des polices, le site ne charge **aucun traceur** par défaut.
- [x] Polices **auto-hébergées** (`assets/fonts/`) → plus aucune requête vers Google Fonts.
- [x] Carte : **OpenStreetMap** (cadre intégré), qui ne dépose **aucun cookie** publicitaire ni de suivi.
      Requête envoyée sans référent (`referrerpolicy="no-referrer"`).
- [x] **Le site ne dépose aucun cookie et n'utilise aucun stockage local** (localStorage / sessionStorage).
- [x] Conséquence : **aucun bandeau de consentement n'est nécessaire** (un bandeau ne gérant aucun traceur
      serait lui-même non conforme). L'ancien bandeau et le mécanisme `ace_consent_v1` ont été **retirés**.
- [x] Avis Google récupérés côté serveur → JSON même origine : **aucun cookie tiers** côté navigateur.

### Logo
- [x] Logo Ace Barber (`assets/img/logo.jpg`) intégré dans l'en-tête (header) de toutes les pages, en rond.
- [x] Le logo étant un disque sombre, il est cerclé d'un léger anneau ivoire et accompagné du
      mot-clé « ACE BARBER » (lisibilité sur fond sombre).
- [x] Repli automatique sur le monogramme « A / ACE BARBER » si le fichier logo est absent
      (détection via `data-brand-logo` + classe `brand--has-logo` en JS).

### Pages juridiques
- [x] `mentions-legales.html`, `confidentialite.html`, `cookies.html` créées et stylées.
- [x] Accessibles depuis le footer de **toutes** les pages.
- [x] Mentions légales renseignées : **Ace Barber (SASU)**, président **Omer Sunbul**,
      **SIREN 104 492 947**, **RCS Strasbourg**, **APE 9602A — Coiffure**, immatriculation **28 mai 2026**,
      hébergeur **GitHub Pages**. Restent à compléter : e-mail, SIRET (NIC), capital social, TVA.
- [x] Politique de confidentialité alignée sur les traitements **réels** (site vitrine, sans formulaire,
      responsable = Ace Barber SASU / Omer Sunbul, carte OpenStreetMap, aucun cookie).
- [x] Politique de cookies indiquant que le site **ne dépose aucun cookie** (rien d'inventé).

### Formulaires
- [x] Audit : le site **ne contient aucun formulaire** → aucune collecte directe, aucune case à créer.

### Sécurité
- [x] Aucune clé API dans le code frontend ni dans Git (clé uniquement en *secret* GitHub Actions).
- [x] `.gitignore` protège `.env` ; `.env.example` documente les variables sans valeurs.
- [x] Liens externes en `rel="noopener noreferrer"` (Instagram, Maps, avis Google) / `rel="noopener"` (Fresha).
- [x] HTTPS assuré par GitHub Pages.
- [x] Données dynamiques injectées via `textContent` + validation numérique (pas d'injection HTML → anti-XSS).
- [x] Aucune dépendance JS tierce (vanilla) ; aucune donnée sensible loggée.

---

## ⚠️ À FOURNIR / VÉRIFIER PAR LE PROPRIÉTAIRE AVANT PUBLICATION

### Avis Google — activation
- [ ] Créer un projet Google Cloud, activer **Places API**, générer une clé **restreinte**.
- [ ] Récupérer le **Place ID** d'Ace Barber (Place ID Finder de Google).
- [ ] Ajouter les secrets du dépôt (Settings → Secrets → Actions) :
      `GOOGLE_PLACES_API_KEY` et `GOOGLE_PLACE_ID`.
- [ ] (Optionnel) Renseigner `CONFIG.googleReviewsUrl` dans `assets/js/main.js` avec l'URL exacte
      des avis (`https://search.google.com/local/reviews?placeid=…`). Sinon, le bouton ouvre la fiche Google via recherche Maps.
- [ ] Tant que ce n'est pas configuré, le site affiche la **dernière valeur connue** (actuellement 5,0 / 28)
      — à confirmer comme exacte, sinon ajuster le fichier `assets/data/google-reviews.json`.

### Menu / prestations
- [ ] **Confirmer que « Coloration » est une prestation réellement proposée** (sinon indiquer la bonne).
      Prestations affichées : Coupe classique · Barbe · Coloration · Soin visage vapeur.

### Mentions légales (obligatoire)
- [x] Raison sociale / statut juridique : **Ace Barber — SASU**.
- [x] Responsable / directeur de la publication : **Omer Sunbul** (président).
- [x] **SIREN 104 492 947**, **RCS Strasbourg**, **APE 9602A — Coiffure**, immatriculation **28 mai 2026**.
- [x] **SIRET** (siège) : 104 492 947 00015.
- [x] **TVA intracommunautaire** : FR 73 104 492 947.
- [x] **E-mail** : non fourni → contact par **téléphone** (suffisant au titre de la LCEN) ;
      champ e-mail retiré des pages. À ajouter si une adresse est créée ultérieurement.
- [ ] **Capital social** : non renseigné (à ajouter si tu souhaites le mentionner).
- [x] Hébergeur : **GitHub Pages** (à mettre à jour si changement d'hébergeur).
- [x] Date de « dernière mise à jour » : 13 août 2026.

### Politique de confidentialité / cookies
- [x] Responsable de traitement identifié : **Ace Barber SASU / Omer Sunbul**.
- [ ] Valider l'**e-mail** du responsable de traitement (champ à compléter).
- [ ] Vérifier les mentions de transfert hors UE selon les prestataires effectivement utilisés.
- [x] Documents datés (13 août 2026).
- [x] Cohérence carte : références **Google Maps** remplacées par **OpenStreetMap** ; mentions de
      consentement / `ace_consent_v1` / « Gérer mes cookies » **retirées** (le site ne dépose aucun cookie).

### Divers
- [ ] Si un **formulaire** de contact est ajouté plus tard → mettre à jour la politique de confidentialité,
      définir la base légale, ajouter l'information RGPD sous le formulaire.
- [ ] Si un outil d'**analyse d'audience**/pixel est ajouté → l'intégrer au système de consentement
      (nouvelle catégorie) et l'ajouter à la politique de cookies.

---

## 🔎 TESTS EFFECTUÉS (automatisés, navigateur headless)
- Rendu desktop (1440/1280) et mobile (360/390/430) : pas de débordement horizontal.
- Console : aucune erreur applicative (hors ressources tierces volontairement bloquées dans l'environnement de test).
- Aucun cookie ni entrée localStorage déposés : plus de bandeau ni de mécanisme de consentement.
- Carte OpenStreetMap : affichée directement, sans cookie.
- Logo : affiché si `assets/img/logo.png` présent ; repli sur le mot-clé « ACE BARBER » sinon.
- Avis Google : lecture de `google-reviews.json` et mise à jour de la note + du nombre (repli sur les valeurs statiques si échec).
- Liens Instagram / Fresha / Google / pages juridiques présents et correctement attribués.

> À refaire manuellement en conditions réelles (vrai navigateur, vraie clé API Google, vrai Place ID)
> avant publication définitive.
