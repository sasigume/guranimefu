import * as admin from 'firebase-admin';
import { AnimeOnFirebase, AnimeForGraphWithLastFetched } from '../../models/mal_v4';

export const addFetchTime = (anime: AnimeOnFirebase): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: admin.firestore.Timestamp.now(),
  };
};
