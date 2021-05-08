import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
import { postToHatenaBlog } from './postToHatenaBlog';

const runtimeOpts = {
  timeoutSeconds: 540,
};

// Scheduler region must equal to app region
exports.postToHatenaBlogManually = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .https.onRequest(async (request, response: any) => {
    const secret = request.headers.authorization as string;

    if (secret !== adminConfig.vercelapp.auth) {
      functions.logger.error('Detected access with invalid token');
      return response.status(401).json({
        message: 'Invalid token',
      });
    } else {
      functions.logger.info('Manually posting to Hatena Blog');
      await postToHatenaBlog()
        .then(() => {
          response.status(200).json({
            message: 'Update complete',
          });
        })
        .catch((e: any) => {
          functions.logger.error(e);
          response.status(500).json({
            message: `Error: ${e}`,
          });
        });
    }
  });

exports.postToHatenaBlog = functions
  .runWith(runtimeOpts)
  .region('asia-northeast1')
  .pubsub.schedule('42 23 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (context: any) => {
    await postToHatenaBlog()
      .then(() => {
        functions.logger.info('Job complete');
        return null;
      })
      .catch((e) => {
        functions.logger.error(`Error: ${e}`);
        return null;
      });
  });
