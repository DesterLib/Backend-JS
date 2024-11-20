import { BaseApi } from "../baseApi";

export class AnilistApi extends BaseApi {
  constructor() {
    super("https://graphql.anilist.co");
  }

  async searchAnime(query: string) {
    const queryData = {
      query: `
        query ($search: String) {
          Media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
          }
        }
      `,
      variables: { search: query },
    };
    return this.post("/", queryData);
  }

  async getAnimeDetails(id: number) {
    const queryData = {
      query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            episodes
            status
          }
        }
      `,
      variables: { id },
    };
    return this.post("/", queryData);
  }
}
