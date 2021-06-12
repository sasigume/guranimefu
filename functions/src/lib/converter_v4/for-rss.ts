import { AnimeOnFirebase, AnimeForRss } from '../../models/mal_v4';

type Converter = (fetchedData: {
  lastFetched: any;
  animesByScore: AnimeOnFirebase[];
}) => AnimeForRss[];

const ConvertForRss: Converter = (fetchedData) => {
  let allAnimeArray = fetchedData.animesByScore;

  // REMOVE SAME ANIMES IN TWO RANKING
  let animesWithoutDuplicate = {} as any;
  for (let item of allAnimeArray) {
    animesWithoutDuplicate[item.mal_id_string] = item;
  }
  const resultWithoutDuplicate = Object.values(animesWithoutDuplicate) as AnimeOnFirebase[];

  const sorted = resultWithoutDuplicate.sort((a, b) =>
    a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
  );

  return sorted.map((anime) => {
    return {
      lastFetched: fetchedData.lastFetched as string,
      title: anime.title_japanese ?? anime.title,
      mal_id: anime.mal_id_string,
      description: `MyAnimeListで${anime.rank}位の評価を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
    };
  });
};

export default ConvertForRss;
