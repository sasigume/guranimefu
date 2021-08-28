import { AnimeOnFirebase, AnimeForSingle } from '../../models/apiv4_appv2';

type Converter = (anime: AnimeOnFirebase) => AnimeForSingle;

const ConvertForSingle: Converter = (anime: AnimeOnFirebase) => {
  return {
    ...anime,
    description: `MyAnimeListで${anime.rank}位の評価を誇るアニメの視聴者数・評価をグラフ化。現在${anime.members}人が視聴済み。`,
  } as AnimeForSingle;
};

export default ConvertForSingle;
