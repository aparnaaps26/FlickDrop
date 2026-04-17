export const config = {
  maxDuration: 15,
};

const PLATFORMS = {
  8: "Netflix", 9: "Prime", 15: "Hulu", 337: "Disney+",
  350: "Apple TV+", 386: "Peacock", 531: "Paramount+",
  1899: "Max", 283: "Crunchyroll", 73: "Tubi",
  122: "Hotstar", 119: "Prime", 300: "Pluto TV",
  220: "JioStar", 2336: "JioStar",
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "TMDB_API_KEY not set. Get a free key at themoviedb.org and add it to Vercel env vars." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { movies } = body || {};
  if (!movies || !Array.isArray(movies)) return res.status(400).json({ error: "Missing movies array" });

  try {
    const results = await Promise.all(movies.map(async (m) => {
      try {
        // Search for the movie
        const q = encodeURIComponent(m.title);
        const searchUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + q + (m.year ? "&year=" + m.year : "");
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const found = searchData.results?.[0];
        if (!found) return { title: m.title, platforms: [], poster: null, tmdbRating: null };

        // Get streaming providers
        const provUrl = "https://api.themoviedb.org/3/movie/" + found.id + "/watch/providers?api_key=" + apiKey;
        const provRes = await fetch(provUrl);
        const provData = await provRes.json();
        const us = provData.results?.US || provData.results?.IN || {};
        const allProviders = [...(us.flatrate || []), ...(us.ads || []), ...(us.free || [])];
        const platforms = allProviders
          .filter(p => PLATFORMS[p.provider_id])
          .map(p => PLATFORMS[p.provider_id])
          .filter((v, i, a) => a.indexOf(v) === i);

        // Get poster
        const poster = found.poster_path ? "https://image.tmdb.org/t/p/w200" + found.poster_path : null;
        const tmdbRating = found.vote_average || null;

        return { title: m.title, platforms, poster, tmdbRating };
      } catch {
        return { title: m.title, platforms: [], poster: null, tmdbRating: null };
      }
    }));

    return res.status(200).json({ results });
  } catch (e) {
    return res.status(500).json({ error: "TMDB error: " + e.message });
  }
}
