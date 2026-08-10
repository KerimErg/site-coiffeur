# Ace Barber — Site vitrine

Site vitrine premium pour **Ace Barber**, barber à Reichstett (près de Strasbourg).
Design sombre, masculin et contemporain — pensé pour convertir les visiteurs en clients
(**Prendre rendez-vous** & **Appeler**).

Le site est **100 % statique** (HTML / CSS / JS, sans dépendance ni build).
Il s'ouvre directement dans un navigateur et se déploie sur n'importe quel hébergeur
statique (GitHub Pages, Netlify, Vercel, OVH…).

---

## 🚀 Aperçu en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit serveur local :

```bash
# Python 3
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

---

## ✏️ Ce que vous pouvez modifier facilement

### 1. Lien de réservation Fresha  ⚠️ à compléter

L'URL exacte de la fiche Fresha d'Ace Barber **n'a pas pu être vérifiée automatiquement**,
donc **aucune URL n'a été inventée**. Le bouton pointe pour l'instant vers Fresha de façon générique.

👉 Ouvrez **`assets/js/main.js`** et remplacez la valeur `bookingUrl` (tout en haut) par
votre lien exact, du type :

```js
bookingUrl: "https://www.fresha.com/a/ace-barber-....-xxxxxxxx/booking",
```

Tous les boutons « Prendre rendez-vous » du site se mettront à jour automatiquement.

### 2. Téléphone et adresse

Dans le même bloc `CONFIG` de `assets/js/main.js` :

```js
phone: "+33767991719",           // utilisé pour l'appel (tel:)
phoneDisplay: "07 67 99 17 19",  // texte affiché
address: "33 Rue du Général Leclerc, 67116 Reichstett", // lien Google Maps
```

### 3. Les photos

Les images sont pour l'instant des **placeholders libres (Unsplash, noir & blanc)** — ce ne sont
**pas** de vraies photos du salon. Pour les remplacer par vos propres clichés :

- **Hero** : attribut `src` de `.hero__img` dans `index.html`.
- **Savoir-faire** : l'`<img>` de la section `#savoir-faire`.
- **Galerie** : les 4 `<img>` de la section `#galerie`.

Conseil : privilégiez des photos en **lumière naturelle**, tons sombres, gros plans (le CSS
applique automatiquement un rendu noir & blanc élégant). Si une image ne charge pas, un
fond sombre texturé prend le relais — le site reste toujours présentable.

### 4. Les tarifs et prestations

Seules les prestations **vérifiées** sont affichées (section `#services` dans `index.html`) :

| Prestation           | Prix  |
|----------------------|-------|
| Coupe classique      | 20 €  |
| Barbe                | 10 €  |
| Coupe + Barbe        | 30 €  |
| Soin visage vapeur   | 25 €  |

> Fresha indique 14 prestations au total, mais **aucun tarif non vérifié n'a été inventé**.
> Ajoutez les autres prestations une fois leurs prix confirmés.

### 5. Couleurs & typographie

Toutes les variables de design sont en haut de **`assets/css/style.css`** (`:root`) :
palette (noir, blanc cassé, or) et polices (Manrope + Fraunces).

---

## 📁 Structure

```
.
├── index.html            # page unique (nav, hero, prestations, savoir-faire,
│                         #  galerie, avis, contact, footer)
├── assets/
│   ├── css/style.css     # design system + responsive
│   └── js/main.js        # config éditable + interactions
└── README.md
```

---

## ✅ Informations utilisées (toutes vérifiées)

- **Nom** : Ace Barber
- **Adresse** : 33 Rue du Général Leclerc, 67116 Reichstett, France
- **Téléphone** : +33 7 67 99 17 19
- **Horaires** : Mar–Sam 10:00–19:00 · Lun & Dim fermé
- **Réputation** : 5,0/5 (~28 avis Google) · 5,0 sur Fresha

Aucune autre information commerciale n'a été inventée.
