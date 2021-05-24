import { AnimeForGraph, ConvertedForMultiGraph, PreConvert } from '../..//models/mal_v2';
import dayjs from 'dayjs';

import { GraphDatasForBump, GraphDatasForLine } from './graph-data-parser';

type Converter = (fetchedData: PreConvert, slice: number) => ConvertedForMultiGraph;

const ConvertForMultiGraph: Converter = (fetchedData, slice) => {
  let allAnimeArray = [...fetchedData.animesByPopularity, ...fetchedData.animesByScore];

  // REMOVE SAME ANIMES IN TWO RANKING
  let animesWithoutDuplicate = {} as any;
  for (let item of allAnimeArray) {
    animesWithoutDuplicate[item.mal_id] = item;
  }
  const resultWithoutDuplicate = Object.values(animesWithoutDuplicate) as AnimeForGraph[];

  const allAnimes = resultWithoutDuplicate.sort((a, b) =>
    a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
  );

  const gdsForBumpScore = GraphDatasForBump({
    animes: fetchedData.animesByScore,
    mode: 'byscore',
  });
  const gdsForLineScore = GraphDatasForLine({
    animes: fetchedData.animesByScore,
    mode: 'byscore',
  });
  const gdsForBumpPop = GraphDatasForBump({
    animes: fetchedData.animesByPopularity,
    mode: 'bypopularity',
  });
  const gdsForLinePop = GraphDatasForLine({
    animes: fetchedData.animesByPopularity,
    mode: 'bypopularity',
  });

  const result = (slice: number) => {
    return {
      lastConverted: dayjs().toDate(),
      sampleLength: gdsForBumpScore[0].data.length,
      allAnimes: allAnimes,

      byScore: {
        gdsForBump: gdsForBumpScore.slice(0, slice),
        gdsForLine: gdsForLineScore.slice(0, slice),
      },

      byPopularity: {
        gdsForBump: gdsForBumpPop.slice(0, slice),
        gdsForLine: gdsForLinePop.slice(0, slice),
      },
    };
  };
  return result(slice) as ConvertedForMultiGraph;
};

export default ConvertForMultiGraph;
