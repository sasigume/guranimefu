const dayjs = require('dayjs');
import { AnimeForGraph } from '../models';

export const convert = (anime: AnimeForGraph): AnimeForGraph => {
  return {
    lastFetched: dayjs().toString,
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
  };
};
