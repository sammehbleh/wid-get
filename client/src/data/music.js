// Fallback pool used only if the iTunes Search API is unreachable.
export const MUSIC_POOL = [
  { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
  { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical" },
  { title: "Sunset Lover", artist: "Petit Biscuit", genre: "Chillwave" },
  { title: "Holocene", artist: "Bon Iver", genre: "Indie Folk" },
  { title: "Intro", artist: "The xx", genre: "Indie" },
  { title: "Breathe", artist: "Telepopmusik", genre: "Trip Hop" },
  { title: "Night Owl", artist: "Galimatias", genre: "Lo-fi" },
  { title: "Strobe", artist: "Deadmau5", genre: "Electronic" },
  { title: "River Flows in You", artist: "Yiruma", genre: "Piano" },
  { title: "Time", artist: "Hans Zimmer", genre: "Soundtrack" },
  { title: "Coffee", artist: "Sylvan Esso", genre: "Indie Pop" },
  { title: "Saturn", artist: "Sleeping at Last", genre: "Indie" },
  { title: "Plastic 100°C", artist: "Sales", genre: "Dream Pop" },
  { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "Classical" },
  { title: "Snowman", artist: "Men I Trust", genre: "Indie Pop" },
];

// Seed terms for the iTunes Search API so each recommendation pulls from a
// different corner of its catalog instead of always returning the same hits.
const SEARCH_TERMS = [
  "lofi",
  "jazz",
  "piano",
  "indie",
  "acoustic",
  "chill",
  "classical",
  "ambient",
  "pop",
  "electronic",
  "soul",
  "folk",
  "synthwave",
  "r&b",
  "soundtrack",
];

function fallbackTrack(exclude) {
  const pool = exclude ? MUSIC_POOL.filter((t) => t.title !== exclude.title) : MUSIC_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function fetchRandomTrack(exclude) {
  const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=25`
    );
    if (!res.ok) throw new Error("iTunes search failed");
    const data = await res.json();

    const candidates = (data.results || [])
      .filter((r) => r.trackName && r.artistName)
      .map((r) => ({
        title: r.trackName,
        artist: r.artistName,
        genre: r.primaryGenreName || term,
        artwork: r.artworkUrl100,
      }))
      .filter((t) => !exclude || t.title !== exclude.title);

    if (candidates.length === 0) throw new Error("No results");
    return candidates[Math.floor(Math.random() * candidates.length)];
  } catch {
    return fallbackTrack(exclude);
  }
}
