import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import { callApiPages } from './lib/update';

const runtimeOpts = {
  timeoutSeconds: 540,
};

const updateFirestoreManually = functions
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

      callApiPages()
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

export default updateFirestoreManually;
