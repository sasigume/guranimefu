import * as admin from 'firebase-admin';
import { AnimeForGraph, AnimeForGraphWithLastFetched } from '../../models/mal_v4';

export const addFetchTime = (anime: AnimeForGraph): AnimeForGraphWithLastFetched => {
  return {
    ...anime,
    lastFetched: admin.firestore.Timestamp.now(),
  };
};
