import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AdminConfig } from '../../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const fetch = require('node-fetch');
const Promise = require('bluebird');
const ColorHash = require('color-hash');
const colorHashGen = new ColorHash();
const dayjs = require('dayjs');
import { MailJet } from '../../lib/mailjet';
import {
  AnimeTop,
  AnimeOnFirebase,
  TopApiResponse,
  AnimeWithColor,
} from '../../models/apiv4_appv2';
import { COLLECTION_APIV4_APPV2, COLLECTION_APIV4_APPV2_BACKUP } from '../common/collections';
const serverDate = admin.firestore.Timestamp.fromDate(new Date());
const today = dayjs(serverDate.toDate()).format('YYYY-MM-DD');

let enableFirestore = true;
//let enableFirestore = false;

//const globalLimit = parseInt(adminConfig.vercelapp.limit) ?? 50;

interface ResultRes {
  resultWithColor: AnimeWithColor[];
}

type ConvertToFirebaseData = (animes: AnimeTop[]) => Promise<AnimeWithColor[]>;

/**
 * データを変換する(文字列型のMAL IDと色を付ける)
 * @param {AnimeTop[]} animes アニメのデータ
 * @returns {Promise<AnimeWithColor[]>} 文字列型のMAL IDと色がついたデータ
 */
const convertToFirebaseData: ConvertToFirebaseData = async (animes: AnimeTop[]) => {
  const addColorAndId = (anime: AnimeTop) => {
    functions.logger.log(`Converting: ${anime.title} (ID: ${anime.mal_id})`);
    return {
      // https://github.com/zenozeng/color-hash
      ...anime,
      mal_id_string: anime.mal_id.toString(),
      color: colorHashGen.hex(anime.mal_id),
    };
  };

  return animes.map((anime) => addColorAndId(anime));
};

/**
 * Firestoreに書き込む
 * @param {AnimeOnFirebase[]} animeJson アニメのデータ
 * @param {Subtype} subtype ランキング種類
 * @returns {void} - ログを残す
 */
const addFireBase = async (animeJson: AnimeOnFirebase[]) => {
  let lastUpdateEnv = 'Cloud Functions';

  return await Promise.all(
    animeJson.map(async (anime: AnimeOnFirebase) => {
      let ref = COLLECTION_APIV4_APPV2.doc(`${anime.mal_id}`);
      let refBackup = COLLECTION_APIV4_APPV2_BACKUP.doc(`${anime.mal_id}`);
      const basicInfo = {
        id: anime.mal_id.toString(),
        color: anime.color ?? '#000',
        label: anime.title_japanese ?? anime.title,
      };

      // These objects can be used directly with chart library like nivo

      const chart_line_score = {
        ...basicInfo,
        data: admin.firestore.FieldValue.arrayUnion(...[{ x: today, y: anime.score }]),
      };
      const chart_bump_score = {
        ...basicInfo,
        data: admin.firestore.FieldValue.arrayUnion(...[{ x: today, y: anime.rank }]),
      };
      const fields = {
        ...anime,
        lastUpdateEnv: lastUpdateEnv,
        lastUpdateTime: dayjs().toString(),
        chart_line_score,
        chart_bump_score,
      };
      return await ref
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
            `Updated ${fields.title_japanese}(ID: ${fields.mal_id}/color: ${fields.color})`,
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
                `Backup completed for ${fields.title_japanese}(ID: ${fields.mal_id}/color: ${fields.color})`,
              );
            });
        });
    }),
  );
};

/**
 * APIに問い合わせて addFirebase を呼ぶ
 * @param {number} page APIのページ
 * @param {Subtype} subtype ランキング種類
 * @returns {void} - ログを残す
 */
const readyToUpdateFirestore = async (page: number) => {
  // Seems like only "by score" is currently supported
  const url = `https://api.jikan.moe/v4/top/anime?page=${page}`;
  functions.logger.info(`Fetch started / url: ${url}`);
  let resultWithColor: AnimeWithColor[] = [];
  return await fetch(url).then(async (res: Response) => {
    if (res) {
      const responseJson: TopApiResponse = await res.json();

      // limit detail fetch by slicing data
      resultWithColor = await convertToFirebaseData(responseJson.data);
      functions.logger.info(`${resultWithColor.length} data converted.`);

      if (enableFirestore) {
        return await addFireBase(resultWithColor)
          .then(() => {
            functions.logger.info(`Updating ${resultWithColor.length} doc`);
          })
          .catch((e) => {
            functions.logger.error(e);
          });
      } else {
        functions.logger.info('Ended without saving data to firestore.');
      }
    } else {
      functions.logger.warn(`The data could not fetched`);
    }
  });
};

/**
 * APIのページ「1」「2」それぞれに問い合わせてFirestoreの更新を実行する
 * @returns {void} - メッセージを返す
 * @see https://stackoverflow.com/a/34820791
 */
export const callApiPages = async () => {
  const pages = [1, 2];

  return await Promise.all(
    pages.map(async (p) => {
      return await readyToUpdateFirestore(p).then((res) => {
        if (res) {
          functions.logger.info(`FINISHED DATA CONVERTING (PAGE ${p})`);
          return res;
        } else {
          return null;
        }
      });
    }),
  )
    .catch((e: any) => {
      let options = {
        title: `Firestoreデータ更新エラー`,
        content: `${serverDate.toDate()}のデータ更新で、readyToUpdateFirestore部分でエラーが発生しました。
      \n\n===
      \n\n## エラー内容
      \n\n${JSON.stringify(e, null, '\t')}`,
        from: adminConfig.common.notice ?? 'cloudFunctions@sasigu.me',
        fromName: 'Heroku jikan-firebase',
        to: adminConfig.common.notice ?? 'sasigume+cloudFunctionsFailed@gmail.com',
      };
      MailJet(options);
    })
    .then((res: ResultRes) => {
      functions.logger.log(`COMPLETED!`);
      return res;
    });
};
