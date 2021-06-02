import * as admin from 'firebase-admin';
export const COLLECTION_V2 = admin.firestore().collection('animeCollection_v2');
export const COLLECTION_BACKUP_V2 = admin.firestore().collection('animeCollection_backup_v2');
