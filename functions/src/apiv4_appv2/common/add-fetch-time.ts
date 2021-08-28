import * as admin from 'firebase-admin';
import { AnimeOnFirebase, AnimeForGraphWithLastFetched } from '../../models/apiv4_appv2';

export const addFetchTime = (anime: AnimeOnFirebase): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: admin.firestore.Timestamp.now(),
  };
};
