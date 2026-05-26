import axios from "axios"
import * as cheerio from "cheerio"

const BASE_URLS = [
  "https://anitaku.bz",
  "https://gogoanime.by"
]

async function fetchWithFallback(path: string) {
  for (const base of BASE_URLS) {
    try {
      const { data } = await axios.get(`${base}${path}`, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      })
      return { data, base }
    } catch (e) {
      continue
    }
  }
  throw new Error("All sources failed")
}

/* ---------------- SEARCH ---------------- */
export async function searchAnime(query: string) {
  const { data, base } = await fetchWithFallback(
    `/search.html?keyword=${encodeURIComponent(query)}`
  )

  const $ = cheerio.load(data)

  const results: any[] = []

  $(".items li").each((_, el) => {
    const a = $(el).find(".name a")

    const title =
      a.attr("title")?.trim() || a.text().trim()

    const id = a.attr("href")

    const image = $(el).find("img").attr("src")

    if (title && id) {
      results.push({
        title,
        id,
        image,
        provider: base
      })
    }
  })

  return results
}

/* ---------------- EPISODES ---------------- */
export async function getEpisodes(animeId: string) {
  const { data } = await fetchWithFallback(animeId)

  const $ = cheerio.load(data)

  const episodes: any[] = []

  $("#episode_page li a").each((_, el) => {
    const epStart = Number($(el).attr("ep_start") || 1)
    const epEnd = Number($(el).attr("ep_end") || epStart)

    for (let i = epStart; i <= epEnd; i++) {
      episodes.push({
        number: i,
        url: `${animeId
          .replace(".html", "")
          .replace("/category/", "")}-episode-${i}`
      })
    }
  })

  return episodes
}

/* ---------------- STREAMS ---------------- */
export async function getStreams(epUrl: string) {
  const { data } = await fetchWithFallback(`/${epUrl}`)

  const $ = cheerio.load(data)

  const streams: any[] = []

  // safer fallback approach
  const iframe = $("iframe").attr("src")

  if (iframe) {
    streams.push({
      quality: "default",
      url: iframe.startsWith("http")
        ? iframe
        : `https:${iframe}`
    })
  } else {
    // fallback (Seanime can try resolving later)
    streams.push({
      quality: "default",
      url: `${BASE_URLS[0]}/${epUrl}`
    })
  }

  return streams
}