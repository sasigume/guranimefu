import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { convert } from './common/convert';
import { AnimeForGraph, Subtype, ConvertedForMultiGraph, AnimeForRss } from '../models/mal';
import ConvertForRss from '../lib/converter/for-rss';

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

  const query = admin.firestore().collection('animeCollection').orderBy(order).limit(50);

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
    const results = {
      lastFetched: dayjs().toString(),
      animesByPopularity: await getAnimesArray('bypopularity'),
      animesByScore: await getAnimesArray('byscore'),
    };

    const converted: AnimeForRss[] = ConvertForRss(results);

    if (converted.length > 0) return response.status(200).json(converted);

    return response.status(500).json({ message: 'Error occured' });
  });

export default getRss;
