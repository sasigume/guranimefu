import * as functions from 'firebase-functions';
import { callApiPages } from './lib/update';

const runtimeOpts = {
  timeoutSeconds: 540,
};

const updateFirestore = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .pubsub.schedule('40 */6 * * *')
  .timeZone('Asia/Tokyo')
  .onRun((context: any) => {
    functions.logger.info('AUTOMATICALLY STARTED JIKAN-FIREBASE SCRIPT');

    callApiPages()
      .then(() => {
        functions.logger.info('Auto update complete');
      })
      .catch((e) => {
        functions.logger.error(`Error: ${e}`);
      });
  });

export default updateFirestore;
