import { AnimeForGraph, AnimeForSingle } from '../../models/mal';
import { GraphDatasForLine } from './graph-data-parser';

type Converter = (anime: AnimeForGraph) => AnimeForSingle;

const ConvertForSingle: Converter = (anime: AnimeForGraph) => {
  const gdsForLineScore = GraphDatasForLine({
    animes: [anime],
    mode: 'byscore',
  });
  const gdsForLinePop = GraphDatasForLine({
    animes: [anime],
    mode: 'bypopularity',
  });

  return {
    color: anime.color,
    cacheTtlOfRanking: anime.cacheTtlOfRanking,
    lastUpdateEnv: anime.lastUpdateEnv,
    lastUpdateTime: anime.lastUpdateTime,
    //updateTimeArray: anime.updateTimeArray,
    mal_id: anime.mal_id,
    title: anime.title,
    title_japanese: anime.title_japanese,
    url: anime.url,
    image_url: anime.image_url,
    type: anime.type,
    start_date: anime.start_date,
    end_date: anime.end_date,
    score: anime.score,
    scored_by: anime.scored_by,
    rankOfScore: anime.rankOfScore,
    rankOfPopularity: anime.rankOfPopularity,
    members: anime.members,
    favorites: anime.favorites,
    membersArray: anime.membersArray,
    scoreArray: anime.scoreArray,
    rankOfScoreArray: anime.rankOfScoreArray,
    rankOfPopularityArray: anime.rankOfPopularityArray,
    gdsForLinePop: gdsForLinePop,
    gdsForLineScore: gdsForLineScore,
  } as AnimeForSingle;
};

export default ConvertForSingle;
