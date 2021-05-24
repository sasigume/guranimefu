import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { convert } from './common/convert';
import ConvertForMultiGraph from '../lib/converter_v2/for-multi-graph';
import { AnimeForGraph, Subtype, ConvertedForMultiGraph } from '../models/mal_v2';
import { COLLECTION_V2 } from './common/collections';

interface Message {
  message: string;
}

const getAnimesArray = async (mode: Subtype) => {
  let order = 'rankOfScore';
  if (mode == 'bypopularity') {
    order = 'rankOfPopularity';
  }
  if (mode == 'byscore') {
    order = 'rankOfScore';
  }

  const query = COLLECTION_V2.orderBy(order).limit(50);

  const snapshot = await query.get();

  const animesData = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const animeOnFirebase = doc.data() as AnimeForGraph;
      return animeOnFirebase;
    }),
  );
  const animesArray = animesData.map((anime: AnimeForGraph) => {
    return convert(anime);
  });

  return animesArray;
};

const getConverted = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: ConvertedForMultiGraph | Message | any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    response.setHeader('Cache-Control', `public, s-maxage=3600, stale-while-revalidate=86400`);

    const results = {
      lastFetched: dayjs().toString(),
      animesByPopularity: await getAnimesArray('bypopularity'),
      animesByScore: await getAnimesArray('byscore'),
    };

    const converted: ConvertedForMultiGraph = ConvertForMultiGraph(results);
    const sample = converted.byScore.gdsForBump;
    if (sample[sample.length - 1].id) {
      const lastDay = sample[0].data[sample[0].data.length - 1].x;

      console.warn(`The final data is: ${lastDay}. Don't forget to import data from cloud!`);
    }

    if (converted.byPopularity && converted.byScore) return response.status(200).json(converted);

    return response.status(500).json({ message: 'Error occured' });
  });

export default getConverted;
