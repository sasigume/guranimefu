import { AnimeForGraph, PreConvert } from '../..//models/mal';

type Converter = (fetchedData: PreConvert) => AnimeForGraph[];

const ConvertForList: Converter = (fetchedData) => {
  let allAnimeArray = [...fetchedData.animesByPopularity, ...fetchedData.animesByScore];

  // REMOVE SAME ANIMES IN TWO RANKING
  let animesWithoutDuplicate = {} as any;
  for (let item of allAnimeArray) {
    animesWithoutDuplicate[item.mal_id] = item;
  }
  const resultWithoutDuplicate = Object.values(animesWithoutDuplicate) as AnimeForGraph[];

  resultWithoutDuplicate.sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0));

  return resultWithoutDuplicate.map((anime: AnimeForGraph) => {
    return {
      color: anime.color,
      cacheTtlOfRanking: anime.cacheTtlOfRanking,
      lastUpdateEnv: anime.lastUpdateEnv,
      lastUpdateTime: anime.lastUpdateTime,
      updateTimeArray: anime.updateTimeArray,
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
  });
};

export default ConvertForList;
