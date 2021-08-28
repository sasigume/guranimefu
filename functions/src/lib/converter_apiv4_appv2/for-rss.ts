import { AnimeOnFirebase, AnimeForRss } from '../../models/apiv4_appv2';

type Converter = (fetchedData: {
  lastFetched: any;
  animesByScore: AnimeOnFirebase[];
}) => AnimeForRss[];

const ConvertForRss: Converter = (fetchedData) => {
  return fetchedData.animesByScore.map((anime) => {
    return {
      lastFetched: fetchedData.lastFetched as string,
      title: anime.title_japanese ?? anime.title,
      mal_id: anime.mal_id_string,
      description: `MyAnimeListで${anime.rank}位の評価を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
    };
  });
};

export default ConvertForRss;
