import axios from "axios"
import * as cheerio from "cheerio"

const BASE_URL = "https://anitaku.bz"

export async function searchAnime(query: string) {
  const url = `${BASE_URL}/search.html?keyword=${encodeURIComponent(query)}`

  const { data } = await axios.get(url)

  const $ = cheerio.load(data)

  const results: any[] = []

  $(".items li").each((_, el) => {
    const title = $(el).find(".name a").attr("title")
    const href = $(el).find(".name a").attr("href")
    const image = $(el).find("img").attr("src")

    results.push({
      title,
      id: href,
      image
    })
  })

  return results
}

export async function getEpisodes(animeId: string) {
  const { data } = await axios.get(`${BASE_URL}${animeId}`)

  const $ = cheerio.load(data)

  const episodes: any[] = []

  $("#episode_page li a").each((_, el) => {
    const epStart = $(el).attr("ep_start")
    const epEnd = $(el).attr("ep_end")

    for (let i = Number(epStart); i <= Number(epEnd); i++) {
      episodes.push({
        number: i,
        url: `${animeId.replace(".html", "")}-episode-${i}`
      })
    }
  })

  return episodes
}

export async function getStreams(epUrl: string) {
  const { data } = await axios.get(`${BASE_URL}/${epUrl}`)

  const $ = cheerio.load(data)

  const streams: any[] = []

  $(".anime_muti_link a").each((_, el) => {
    const url = $(el).attr("data-video")

    streams.push({
      quality: "default",
      url
    })
  })

  return streams
}