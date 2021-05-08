import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');
import { AnimeForGraph, AnimeForSingle } from '../models/mal';
import { convert } from './common/convert';
import ConvertForSingle from '../lib/converter/for-single';
interface Message {
  message: string;
}

const getByIdConverted = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response: AnimeForSingle | Message | any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      return response.status(401).json({
        message: 'Invalid token',
      });
    }
    let mal_id = request.query.mal_id as string;

    const query = admin.firestore().collection('animeCollection').doc(mal_id);

    const snapshot = await query.get();

    const animeData = snapshot.data() as AnimeForGraph;

    const result = convert(animeData);

    const converted = ConvertForSingle(result);

    response.send(converted);
  });

export default getByIdConverted;
