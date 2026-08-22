// =====================================================================
// Ace Barber — synchronisation des avis Google (exécuté par GitHub Actions)
// ---------------------------------------------------------------------
// Récupère UNIQUEMENT la note et le nombre total d'avis via l'API officielle
// Google Places, puis écrit assets/data/google-reviews.json.
//
// Sécurité :
//  - la clé API n'existe QUE dans les secrets GitHub (jamais dans le front,
//    jamais commitée) ;
//  - en cas d'erreur / clé absente / réponse invalide, on NE réécrit PAS le
//    fichier : la dernière valeur valide est conservée.
//
// Secrets attendus (Repo > Settings > Secrets and variables > Actions) :
//  - GOOGLE_PLACES_API_KEY : clé API Google (API "Places" activée)
//  - GOOGLE_PLACE_ID       : identifiant de la fiche Ace Barber (Place ID)
// =====================================================================
import { readFile, writeFile } from "node:fs/promises";

const OUT = "assets/data/google-reviews.json";
const KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACE_ID;

async function readCurrent() {
  try { return JSON.parse(await readFile(OUT, "utf8")); }
  catch { return null; }
}

function keep(reason) {
  console.log(`[google-reviews] Conservation de la valeur actuelle : ${reason}`);
  process.exit(0); // succès : on ne touche pas au fichier
}

const current = await readCurrent();

if (!KEY || !PLACE_ID) {
  keep("GOOGLE_PLACES_API_KEY et/ou GOOGLE_PLACE_ID non configurés.");
}

const url =
  "https://maps.googleapis.com/maps/api/place/details/json" +
  `?place_id=${encodeURIComponent(PLACE_ID)}` +
  "&fields=rating,user_ratings_total" +
  "&language=fr" +
  `&key=${encodeURIComponent(KEY)}`;

let data;
try {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) keep(`HTTP ${res.status}`);
  data = await res.json();
} catch (e) {
  keep(`échec réseau : ${e.message}`);
}

if (!data || data.status !== "OK" || !data.result) {
  keep(`statut API : ${data ? data.status : "inconnu"}`);
}

const rating = Number(data.result.rating);
const reviewCount = Number(data.result.user_ratings_total);

if (!Number.isFinite(rating) || !Number.isFinite(reviewCount) || reviewCount < 0) {
  keep("champs rating / user_ratings_total invalides.");
}

const next = {
  rating: Math.round(rating * 10) / 10,
  reviewCount: Math.round(reviewCount),
  lastUpdated: new Date().toISOString(),
  source: "google-places"
};

if (current && current.rating === next.rating && current.reviewCount === next.reviewCount) {
  // Valeurs identiques : on met seulement à jour l'horodatage localement,
  // mais on évite un commit inutile si rien d'autre ne change.
  console.log("[google-reviews] Aucune évolution (note/nombre inchangés).");
}

await writeFile(OUT, JSON.stringify(next, null, 2) + "\n", "utf8");
console.log(`[google-reviews] Mis à jour : ${next.rating}/5 · ${next.reviewCount} avis`);
