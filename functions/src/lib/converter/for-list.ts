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

  return resultWithoutDuplicate.sort((a, b) =>
    a.score > b.score ? -1 : b.score > a.score ? 1 : 0,
  );
};

export default ConvertForList;
