import { AnimeForGraph, AnimeForSingle } from '../../models/mal_v4';

type Converter = (anime: AnimeForGraph) => AnimeForSingle;

const ConvertForSingle: Converter = (anime: AnimeForGraph) => {
  return {
    ...anime,
    description: `MyAnimeListで${anime.rank}位の評価を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
  } as AnimeForSingle;
};

export default ConvertForSingle;
