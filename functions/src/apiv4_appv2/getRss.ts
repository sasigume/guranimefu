import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { addFetchTime } from './common/add-fetch-time';
import { Subtype, ConvertedForMultiGraph, AnimeForRss, AnimeOnFirebase } from '../models/mal_v4';
import ConvertForRss from '../lib/converter_v4/for-rss';
import { COLLECTION_APIV4_APPV2 } from './common/collections';

interface Message {
  message: string;
}

const getAnimesArray = async (mode: Subtype) => {
  let order = 'rank';
  if (mode == 'bypopularity') {
    order = 'rankOfPopularity';
  }
  if (mode == 'byscore') {
    order = 'rank';
  }

  const query = COLLECTION_APIV4_APPV2.orderBy(order).limit(50);

  const snapshot = await query.get();

  return await Promise.all(
    snapshot.docs.map(async (doc) => {
      const animeOnFirebase = doc.data() as AnimeOnFirebase;
      return addFetchTime(animeOnFirebase);
    }),
  );
};

const getRss = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: ConvertedForMultiGraph | Message | any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    response.setHeader('Cache-Control', `public, s-maxage=3600, stale-while-revalidate=86400`);
    const animes = await getAnimesArray('byscore');
    const results = {
      lastFetched: dayjs().toString(),
      animesByPopularity: await getAnimesArray('bypopularity'),
      animesByScore: animes ?? [],
    };

    const converted: AnimeForRss[] = ConvertForRss(results);

    if (converted.length > 0) {
      return response.status(200).json(converted);
    } else {
      return response.status(500).json({ message: 'Error occured' });
    }
  });

export default getRss;
