import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');
import { AnimeForGraph } from '../models/mal_v2';
import { convert } from './common/convert';
import { COLLECTION_V2 } from './common/collections';
interface Message {
  message: string;
}

/*

重要: このファンクションは v0.6.0 以降のクライアントでは使えません

*/

const getById = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: AnimeForGraph | Message | any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }
    let mal_id = request.query.mal_id as string;

    const query = COLLECTION_V2.doc(mal_id);

    const snapshot = await query.get();

    const animeData = (await snapshot.data()) as AnimeForGraph;

    const result = convert(animeData);

    response.send(result);
  });

export default getById;
