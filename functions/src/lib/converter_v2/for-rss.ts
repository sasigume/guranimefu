import { AnimeForGraph, AnimeForRss, PreConvert } from '../../models/mal_v2';

type Converter = (fetchedData: PreConvert) => AnimeForRss[];

const ConvertForRss: Converter = (fetchedData) => {
  let allAnimeArray = [...fetchedData.animesByPopularity, ...fetchedData.animesByScore];

  // REMOVE SAME ANIMES IN TWO RANKING
  let animesWithoutDuplicate = {} as any;
  for (let item of allAnimeArray) {
    animesWithoutDuplicate[item.mal_id] = item;
  }
  const resultWithoutDuplicate = Object.values(animesWithoutDuplicate) as AnimeForGraph[];

  const sorted = resultWithoutDuplicate.sort((a, b) =>
    a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
  );

  return sorted.map((anime) => {
    return {
      lastFetched: fetchedData.lastFetched,
      title: anime.title_japanese ?? anime.title,
      mal_id: anime.mal_id,
      description: `MyAnimeListで${anime.rankOfPopularity}位の人気を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
    };
  });
};

export default ConvertForRss;
