import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const fetch = require('node-fetch');
const Promise = require('bluebird');
const ColorHash = require('color-hash');
const colorHashGen = new ColorHash();
const dayjs = require('dayjs');
import { MailJet } from '../lib/mailjet';
import { AnimeTop, AnimeDetail, AnimeOnFirebase, Subtype } from '../models/mal';
const serverDate = admin.firestore.Timestamp.fromDate(new Date());
const today = dayjs(serverDate.toDate()).format('YYYY-MM-DD');

let enableFirestore = true;
//let enableFirestore = false;

let globalLimit = parseInt(adminConfig.vercelapp.limit) ?? 50;

interface ResultRes {
  resultWithDetail: AnimeDetail[];
  cacheTtlOfRanking: number;
}

interface JikanTopRes {
  top: AnimeDetail[];
  request_cache_expiry: number;
}

/* -------------------------------------------
// CONVERT DATA TO SAVE IN FIRESTORE
--------------------------------------------- */
type ConvertToFirebaseData = (anime: AnimeTop) => Promise<AnimeOnFirebase>;

const convertToFirebaseData: ConvertToFirebaseData = async (anime: AnimeTop) => {
  // Avoiding api limit thanks to bluebird.js
  const getDetail = async (anime: AnimeTop) => {
    const resDetail = await fetch('https://api.jikan.moe/v3/anime/' + anime.mal_id);
    const detailData = (await resDetail.json()) as AnimeDetail;
    functions.logger.log(`Got detail of: ${detailData.title_japanese} (ID: ${anime.mal_id})`);

    // Data is mixed because Jikan's return somehow differs depends on API type
    return {
      // https://github.com/zenozeng/color-hash
      color: colorHashGen.hex(anime.mal_id),
      mal_id: anime.mal_id,
      title: anime.title ?? 'タイトル未設定',
      title_japanese: detailData.title_japanese ?? '日本語タイトル未設定',
      url: anime.url ?? null,
      image_url: anime.image_url ?? '画像未設定',
      type: anime.type ?? '種類未設定',
      score: detailData.score ?? null,
      start_date: anime.start_date ?? null,
      end_date: anime.end_date ?? 'まだ終了していない',
      scored_by: detailData.scored_by ?? null,
      rankOfScore: detailData.rank ?? null, // this field is always rank of 'score'
      rankOfPopularity: detailData.popularity ?? null,
      members: detailData.members ?? null,
      favorites: detailData.favorites ?? null,
    };
  };

  // wait to avoid rate limit of Jikan
  return new Promise((resolve: any) => {
    setTimeout(() => resolve(getDetail(anime)), 3000);
  });
};

/* -------------------------------------------
// UPDATE EACH FIREBASE DOC
--------------------------------------------- */

const addFireBase = async (
  animeJson: AnimeOnFirebase[],
  cacheTtlOfRanking: number,
  subtype: Subtype,
) => {
  let lastUpdateEnv = 'Cloud Functions';

  return await animeJson.map(async (anime: AnimeOnFirebase, n: number) => {
    let ref = await admin.firestore().collection('animeCollection').doc(`${anime.mal_id}`);
    let refBackup = await admin
      .firestore()
      .collection('animeCollection_backup')
      .doc(`${anime.mal_id}`);

    const fields = {
      color: anime.color,
      cacheTtlOfRanking: cacheTtlOfRanking,
      lastUpdateEnv: lastUpdateEnv,
      lastUpdateTime: admin.firestore.Timestamp.now(),
      //updateTimeArray: firebase.firestore.FieldValue.arrayUnion(...[{ [today]: firebase.firestore.Timestamp.now() }]),
      mal_id: anime.mal_id,
      title: anime.title,
      title_japanese: anime.title_japanese,
      url: anime.url,
      image_url: anime.image_url,
      type: anime.type,
      start_date: anime.start_date,
      end_date: anime.end_date,
      score: anime.score,
      scored_by: anime.scored_by,
      members: anime.members,
      favorites: anime.favorites,
      rankOfPopularity: anime.rankOfPopularity,
      rankOfScore: anime.rankOfScore,
      membersArray: admin.firestore.FieldValue.arrayUnion(...[{ [today]: anime.members }]),
      scoreArray: admin.firestore.FieldValue.arrayUnion(...[{ [today]: anime.score }]),
      rankOfScoreArray: admin.firestore.FieldValue.arrayUnion(...[{ [today]: anime.rankOfScore }]),
      rankOfPopularityArray: admin.firestore.FieldValue.arrayUnion(
        ...[{ [today]: anime.rankOfPopularity }],
      ),
    };
    ref
      .set(
        {
          ...fields,
        },
        { merge: true },
      )
      .catch((e: any) => {
        functions.logger.error(`ERROR ON SAVING PRIMARY COLLECTION: ${e}`);
      })
      .then((writeResult) => {
        functions.logger.log(`WriteResult: ${writeResult}`);
        functions.logger.log(
          `Updated ${fields.title_japanese}(ID: ${fields.mal_id}/color: ${fields.color}), ${subtype} mode`,
        );
        refBackup
          .set(
            {
              ...fields,
            },
            { merge: true },
          )
          .catch((e: any) => {
            functions.logger.error(`ERROR ON SAVING BACKUP COLLECTION: ${e}`);
          })
          .then(() => {
            functions.logger.log(
              `Backup completed for ${fields.title_japanese}(ID: ${fields.mal_id}/color: ${fields.color}), ${subtype} mode`,
            );
          });
      });

    if (animeJson.length - 1 == n) {
      return true;
    }

    return false;
  });
};

/* -------------------------------------------
// GET DATA AND PASS TO FIREBASE
--------------------------------------------- */

const readyToUpdateFirestore = async (subtype: Subtype, limit: number) => {
  let jikanMode = 'bypopularity';
  if (subtype == 'byscore') {
    // blank means sort by score for Jikan
    jikanMode = '';
  }
  if (subtype == 'bypopularity') {
    jikanMode = 'bypopularity';
  }
  const url = 'https://api.jikan.moe/v3/top/anime/1/' + jikanMode;
  functions.logger.info(`Fetch started for: ${subtype} / url: ${url}`);
  let cacheTtlOfRanking = 0;
  let resultWithDetail = [];
  const res = await fetch(url);
  if (res) {
    const data: JikanTopRes = await res.json();

    if (data.request_cache_expiry) {
      cacheTtlOfRanking = data.request_cache_expiry;
      functions.logger.warn(
        `The data for ${subtype} from Jikan API expires in ${cacheTtlOfRanking} seconds.`,
      );
      // limit detail fetch by slicing data
      resultWithDetail = await Promise.mapSeries(data.top.slice(0, limit), convertToFirebaseData);
      functions.logger.info(`${resultWithDetail.length} data converted.`);

      if (enableFirestore) {
        await addFireBase(resultWithDetail, cacheTtlOfRanking, subtype).then(() => {
          functions.logger.info(`Updating ${resultWithDetail.length} docs for ${subtype}`);
        });
      } else {
        functions.logger.info('Ended without saving data to firestore.');
      }
    } else {
      functions.logger.warn(`The data for ${subtype} has no cacheTtl: ${JSON.stringify(data)}`);
    }
  } else {
    functions.logger.warn(`The data for ${subtype} could not fetched`);
  }
  return { resultWithDetail, cacheTtlOfRanking } as ResultRes;
};

/* -------------------------------------------
// EXECUTE EACH UPDATE SEQUENTIALLY
--------------------------------------------- */

// https://stackoverflow.com/a/34820791
const updateFirestore = async (modes: Subtype[]) => {
  const limit = globalLimit;

  Promise.all(
    modes.map(async (mode) => {
      return {
        [mode]: await readyToUpdateFirestore(mode, limit).then((res) => {
          if (res) {
            functions.logger.info(`FINISHED DATA CONVERTING FOR: ${mode}`);
            return res;
          } else {
            return null;
          }
        }),
      };
    }),
  )
    .catch((e: any) => {
      let options = {
        title: `Firestoreデータ更新エラー`,
        content: `${serverDate.toDate()}のデータ更新で、readyToUpdateFirestore部分でエラーが発生しました。
      \n\n===
      \n\n## エラー内容
      \n\n${JSON.stringify(e, null, '\t')}`,
        from: adminConfig.common.notice ?? 'cloudFunctions@ima.icu',
        fromName: 'Heroku jikan-firebase',
        to: adminConfig.common.notice ?? 'sasigume+cloudFunctionsFailed@gmail.com',
      };
      MailJet(options);
    })
    .then((res: ResultRes) => {
      functions.logger.log(`COMPLETED! TTL:${res.cacheTtlOfRanking}`);
      return res;
    });
};

export default updateFirestore;
