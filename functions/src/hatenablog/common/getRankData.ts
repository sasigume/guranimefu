import { HatenaMode, Subtype, AnimeDetail } from '../../models/mal';
import { convertAnime } from './convertAnime';
const Promise = require('bluebird');

const fetch = require('node-fetch');

/* -------------------------
GET RANKING OF ANIMES
---------------------------- */

// Post anime ranking to my blog
export const getRankData = async (hatenaMode: HatenaMode, limit: number) => {
  // blank means sort by score
  let subtype: Subtype = '';

  if (hatenaMode == 'bypopularity') {
    subtype = 'bypopularity';
  }
  if (hatenaMode == 'movie') {
    subtype = 'movie';
  }
  if (hatenaMode == 'upcoming') {
    subtype = 'upcoming';
  }
  if (hatenaMode == 'byscore') {
    subtype = '';
  }

  const res = await fetch('https://api.jikan.moe/v3/top/anime/1/' + subtype);
  const data = await res.json();

  // limit detail fetch by slicing data
  const resultWithDetail: AnimeDetail[] = await Promise.map(
    data.top.slice(0, limit),
    convertAnime,
    {
      concurrency: 1,
    },
  );

  if (resultWithDetail.length > 0) {
    return resultWithDetail;
  } else {
    return [];
  }
};
