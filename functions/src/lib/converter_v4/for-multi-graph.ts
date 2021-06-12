import { AnimeOnFirebase, ConvertedForMultiGraph, PreConvertV4 } from '../..//models/mal_v4';
import dayjs from 'dayjs';

import { GraphDatasForBump, GraphDatasForLine } from './graph-data-parser';

type Converter = (fetchedData: PreConvertV4, slice: number) => ConvertedForMultiGraph;

const ConvertForMultiGraph: Converter = (fetchedData, slice) => {
  let allAnimeArray = [...fetchedData.animesByScore];

  // REMOVE SAME ANIMES IN TWO RANKING
  let animesWithoutDuplicate = {} as any;
  for (let item of allAnimeArray) {
    animesWithoutDuplicate[item.mal_id] = item;
  }
  const resultWithoutDuplicate = Object.values(animesWithoutDuplicate) as AnimeOnFirebase[];

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

  const result = (slice: number) => {
    return {
      lastConverted: dayjs().toDate(),
      sampleLength: gdsForBumpScore[0].data.length,
      allAnimes: allAnimes,

      byScore: {
        gdsForBump: gdsForBumpScore.slice(0, slice),
        gdsForLine: gdsForLineScore.slice(0, slice),
      },
    };
  };
  return result(slice) as ConvertedForMultiGraph;
};

export default ConvertForMultiGraph;
