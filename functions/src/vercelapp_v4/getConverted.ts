import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { addFetchTime } from './common/add-fetch-time';
import ConvertForMultiGraph from '../lib/converter_v4/for-multi-graph';
import { Subtype, ConvertedForMultiGraph, AnimeOnFirebase } from '../models/mal_v4';
import { COLLECTION_V4 } from './common/collections';

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

  const query = COLLECTION_V4.orderBy(order).limit(50);

  const snapshot = await query.get();

  const animesData = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const animeOnFirebase = doc.data() as AnimeOnFirebase;
      return animeOnFirebase;
    }),
  );
  const animesArray = animesData.map((anime: AnimeOnFirebase) => {
    return addFetchTime(anime);
  });

  return animesArray;
};

const getConverted = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: ConvertedForMultiGraph | Message | any) => {
    const secret = request.headers.authorization as string;
    const limitQuery = request.query.limit as string | undefined;
    const limit = parseInt(limitQuery ?? '50');

    functions.logger.info(`Limit is: ${limit}`);

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    response.setHeader('Cache-Control', `public, s-maxage=3600, stale-while-revalidate=86400`);

    const results = {
      lastFetched: dayjs().toString(),
      //animesByPopularity: await getAnimesArray('bypopularity'),
      animesByScore: await getAnimesArray('byscore'),
    };

    const converted: ConvertedForMultiGraph = ConvertForMultiGraph(results, limit);
    const sample = converted.byScore.gdsForBump ?? [];
    if (sample[sample.length - 1].id) {
      const lastDay = sample[0].data[sample[0].data.length - 1].x;

      console.warn(`The final data is: ${lastDay}. Don't forget to import data from cloud!`);
    }

    if (converted.byScore) return response.status(200).json(converted);

    return response.status(500).json({ message: 'Error occured' });
  });

export default getConverted;
