import * as admin from 'firebase-admin';
import { AnimeForGraph, AnimeForGraphWithLastFetched } from '../../models/mal_v2';

export const addFetchTime = (anime: AnimeForGraph): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: admin.firestore.Timestamp.now(),
  };
};
