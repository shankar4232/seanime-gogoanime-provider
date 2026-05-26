import {
  searchAnime,
  getEpisodes,
  getStreams
} from "./gogo"

export default {
  name: "Gogoanime",

  async search(query: string) {
    return searchAnime(query)
  },

  async episodes(animeId: string) {
    return getEpisodes(animeId)
  },

  async streams(episodeUrl: string) {
    return getStreams(episodeUrl)
  }
}