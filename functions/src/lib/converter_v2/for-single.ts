import { AnimeForGraph, AnimeForSingle } from '../../models/mal_v2';

type Converter = (anime: AnimeForGraph) => AnimeForSingle;

const ConvertForSingle: Converter = (anime: AnimeForGraph) => {
  return {
    ...anime,
    description: `MyAnimeListで${anime.rankOfPopularity}位の人気を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
  } as AnimeForSingle;
};

export default ConvertForSingle;
