const dayjs = require('dayjs');
import { AnimeForGraph, AnimeForGraphWithLastFetched } from '../../models/mal_v2';

export const convert = (anime: AnimeForGraph): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: dayjs().toString,
  };
};
