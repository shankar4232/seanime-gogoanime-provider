// src/gogo.ts
import axios from "axios";
import * as cheerio from "cheerio";
var BASE_URL = "https://anitaku.bz";
async function searchAnime(query) {
  const url = `${BASE_URL}/search.html?keyword=${encodeURIComponent(query)}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const results = [];
  $(".items li").each((_, el) => {
    const title = $(el).find(".name a").attr("title");
    const href = $(el).find(".name a").attr("href");
    const image = $(el).find("img").attr("src");
    results.push({
      title,
      id: href,
      image
    });
  });
  return results;
}
async function getEpisodes(animeId) {
  const { data } = await axios.get(`${BASE_URL}${animeId}`);
  const $ = cheerio.load(data);
  const episodes = [];
  $("#episode_page li a").each((_, el) => {
    const epStart = $(el).attr("ep_start");
    const epEnd = $(el).attr("ep_end");
    for (let i = Number(epStart); i <= Number(epEnd); i++) {
      episodes.push({
        number: i,
        url: `${animeId.replace(".html", "")}-episode-${i}`
      });
    }
  });
  return episodes;
}
async function getStreams(epUrl) {
  const { data } = await axios.get(`${BASE_URL}/${epUrl}`);
  const $ = cheerio.load(data);
  const streams = [];
  $(".anime_muti_link a").each((_, el) => {
    const url = $(el).attr("data-video");
    streams.push({
      quality: "default",
      url
    });
  });
  return streams;
}

// src/index.ts
var index_default = {
  name: "Gogoanime",
  async search(query) {
    return await searchAnime(query);
  },
  async episodes(animeId) {
    return await getEpisodes(animeId);
  },
  async streams(episodeUrl) {
    return await getStreams(episodeUrl);
  }
};
export {
  index_default as default
};
