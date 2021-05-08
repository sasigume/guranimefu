import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import getAll from './getAll';
import getById from './getById';
import updateFirestore from './updateFirestore';

const runtimeOpts = {
  timeoutSeconds: 540,
};

exports.getAll = getAll;
exports.getById = getById;

exports.updateFirestore = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .pubsub.schedule('0 */6 * * *')
  .timeZone('Asia/Tokyo')
  .onRun((context: any) => {
    functions.logger.info('AUTOMATICALLY STARTED JIKAN-FIREBASE SCRIPT');

    updateFirestore(['bypopularity', 'byscore'])
      .then(() => {
        functions.logger.info('Auto update complete');
      })
      .catch((e) => {
        functions.logger.error(`Error: ${e}`);
      });
  });

exports.updateFirestoreManually = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .https.onRequest((request, response: any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      functions.logger.error('Detected access with invalid token');
      return response.status(401).json({
        message: 'Invalid token',
      });
    } else {
      functions.logger.info('MANUALLY STARTED JIKAN-FIREBASE SCRIPT');

      updateFirestore(['bypopularity', 'byscore'])
        .then(() => {
          response.status(200).json({
            message: 'Update complete',
          });
        })
        .catch((e) => {
          response.status(500).json({
            message: `Error: ${e}`,
          });
        });
    }
  });
