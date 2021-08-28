import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');
import { AnimeForSingle, AnimeOnFirebase } from '../models/apiv4_appv2';
import { addFetchTime } from './common/add-fetch-time';
import ConvertForSingle from '../lib/converter_apiv4_appv2/for-single';
import { COLLECTION_APIV4_APPV2 } from './common/collections';
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

    const query = COLLECTION_APIV4_APPV2.doc(mal_id);

    const snapshot = await query.get();

    const animeData = snapshot.data() as AnimeOnFirebase;

    const result = addFetchTime(animeData);

    const converted = ConvertForSingle(result);

    response.send(converted);
  });

export default getByIdConverted;
