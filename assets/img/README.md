# Images du site Ace Barber

Photos réelles du salon + dérivés WebP optimisés (chargés en priorité, fallback JPEG automatique).

| Fichier            | Utilisation sur le site (refonte « The Ace Experience »)        |
|--------------------|-----------------------------------------------------------------|
| `IMG_3389.jpeg`    | Salon — **remplit le mot « ACE » du Hero** + grande photo « Le salon » |
| `IMG_3390.jpeg`    | Espace d'attente — encart de la section « Le salon »            |
| `coupe1.jpeg`      | Réalisations — dégradé bouclé                                    |
| `coupe2.jpeg`      | Réalisations — fade & boucles                                    |
| `coupe3.jpeg`      | Réalisations — coiffé arrière & barbe                            |
| `*.webp`           | Versions optimisées (générées automatiquement, ~60 % plus légères) |

## Remplacer / ajouter une photo
1. Déposez le nouveau JPEG dans `assets/img/` (même nom pour un remplacement direct).
2. Régénérez le `.webp` correspondant, ou supprimez l'ancien `.webp` (le site basculera
   automatiquement sur le JPEG si le WebP est absent).
3. Au besoin, ajustez le `src` / `object-position` dans `index.html`.
