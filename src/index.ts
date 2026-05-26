import {
  searchAnime,
  getEpisodes,
  getStreams
} from "./gogo"

export default {
  name: "Gogoanime",

  async search(query: string) {
    return await searchAnime(query)
  },

  async episodes(animeId: string) {
    return await getEpisodes(animeId)
  },

  async streams(episodeUrl: string) {
    return await getStreams(episodeUrl)
  }
}