const dayjs = require('dayjs');
import { AnimeForGraph, AnimeForGraphWithLastFetched } from '../../models/mal';

export const convert = (anime: AnimeForGraph): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: dayjs().toString,
  };
};
