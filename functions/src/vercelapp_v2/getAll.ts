import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');

import { AnimeForGraph, Subtype } from '../models/mal_v2';
import { convert } from './common/convert';
import { COLLECTION_V2 } from './common/collections';

/*

重要: このファンクションは v0.6.0 以降のクライアントでは使えません

*/

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

  const animesData = snapshot.docs.map((doc) => {
    const animeOnFirebase = doc.data() as AnimeForGraph;
    return animeOnFirebase;
  });

  const animesArray = await Promise.all(
    animesData.map(async (anime: AnimeForGraph) => {
      return convert(anime);
    }),
  ).catch((e) => functions.logger.error(e));

  return animesArray;
};

const getAll = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }

    const results = await {
      lastFetched: dayjs().toString(),
      animesByPopularity: await getAnimesArray('bypopularity'),
      animesByScore: await getAnimesArray('byscore'),
    };

    response.send(results);
  });

export default getAll;
