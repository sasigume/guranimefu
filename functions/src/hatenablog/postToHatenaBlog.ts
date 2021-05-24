import * as functions from 'firebase-functions';
import { AdminConfig } from '../models/AdminConfig';
const adminConfig = functions.config() as AdminConfig;
const dayjs = require('dayjs');
import 'dayjs/locale/ja';
dayjs.locale('ja');
import { MailJet } from '../lib/mailjet';
import { AnimeDetail, HatenaMode } from '../models/mal';
import { getRankData } from './common/getRankData';

const json2md = require('json2md');

/* -------------------------
GENERATE MARKDOWN
---------------------------- */

const generateArticle = async (hatenaMode: HatenaMode) => {
  let limit: number;
  let graphSize = 50;
  if (adminConfig.hatenablog.limit !== (null || undefined)) {
    limit = parseInt(adminConfig.hatenablog.limit);
    if (isNaN(limit) || limit < 5) {
      console.log(`Please set limit to 5 or more!`);
      limit = 5;
      graphSize = 5;
    } else {
      if (limit > 50) {
        limit = 50;
        graphSize = 10;
      } else {
        graphSize = Math.round(limit / 5);
      }
    }
    console.log(`Data is limited by env.`);
  } else {
    limit = 50;
    graphSize = 10;
  }
  console.log(`Started fetching ${limit} data. I'll generate bar chart with ${graphSize} data.`);

  // IMPORTANT: increase limit OTHERWISE FAIL TO LOAD WHAT ANIME IS AFTER THE GRAPH!
  if (limit == graphSize) {
    limit = limit + 1;
  }
  const content = await getRankData(hatenaMode, limit)
    .then((resultWithDetail) => {
      if (resultWithDetail && resultWithDetail.length > 0) {
        const firstAnime = {
          title: resultWithDetail[0].title,
          title_japanese: resultWithDetail[0].title_japanese,
          members: resultWithDetail[0].members,
          score: resultWithDetail[0].score,
        };

        // convert to md or html
        let date = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);
        const now = dayjs(date).format('HH:mm:ss');
        const today = dayjs(date).format('YYYY/MM/DD');

        const convertToMd = (anime: AnimeDetail) => {
          functions.logger.debug('Converting: ' + anime);
          let heading: string;
          let ulArray: string[] = [''];
          if (hatenaMode == 'bypopularity') {
            heading = ' (' + (anime.members?.toLocaleString('ja-JP') ?? 0) + '人視聴)';
            ulArray = [
              'スコア: **' + anime.score + '**',
              '放送・公開開始時期: ' + anime.start_date,
            ];
          }
          if (hatenaMode == 'upcoming') {
            heading = ' (' + (anime.members?.toLocaleString('ja-JP') ?? 0) + '人視聴予定)';
            ulArray = ['放送・公開開始時期: ' + anime.start_date];
          } else {
            heading = ' (スコア: ' + anime.score + ')';
            ulArray = [
              '視聴者数: **' + (anime.members?.toLocaleString('ja-JP') ?? 0) + '人**',
              '放送・公開開始時期: ' + anime.start_date,
            ];
          }

          return [
            { h2: anime.rank + '. ' + anime.title_japanese + heading },
            { link: { title: 'MyAnimeListで詳細を見る', source: anime.url } },
            { img: { title: 'MyAnimeListのサムネ', source: anime.image_url } },
            {
              ul: ulArray,
            },
            { p: '' },
          ];
        };

        const convertToGraphHtml = (anime: AnimeDetail) => {
          functions.logger.debug('Converting: ' + anime);
          let relativeWidth = 0;
          let rightNumber = 0;
          if (anime.score != undefined) {
            if (hatenaMode == 'bypopularity' || hatenaMode == 'upcoming') {
              relativeWidth =
                ((anime.members ?? 0) - (resultWithDetail[graphSize].members ?? 0)) /
                ((firstAnime.members ?? 0) - (resultWithDetail[graphSize].members ?? 0));
              rightNumber = anime.members ?? 0;
            } else {
              relativeWidth =
                ((anime.score ?? 10) - (resultWithDetail[graphSize].score ?? 0)) /
                ((firstAnime.score ?? 10) - (resultWithDetail[graphSize].score ?? 0));
              rightNumber = anime.score ?? 0;
            }
          }
          return (
            '<div class="graphBox"><div style="width: ' +
            relativeWidth * 100 +
            '%;" class="title">' +
            (anime.rank ?? 0) +
            '. ' +
            (anime.title_japanese ?? '') +
            '</div><div class="rightnumber">' +
            rightNumber +
            '</div></div>'
          );
        };

        const convertToTableRow = (anime: AnimeDetail) => {
          functions.logger.debug('Converting: ' + anime);
          let tableNumber: number;
          if (hatenaMode == 'bypopularity' || hatenaMode == 'upcoming') {
            tableNumber = anime.members ?? 0;
          } else {
            tableNumber = anime.score ?? 0;
          }
          return `| ${anime.title_japanese ?? ''} | ${tableNumber} |\n`;
        };

        let graphHtml = '';
        let footerTable = '';
        let dataJson = {};
        if (resultWithDetail.length > 0) {
          graphHtml = resultWithDetail
            .slice(0, graphSize)
            .map((anime: AnimeDetail) => convertToGraphHtml(anime))
            .join('');
          dataJson = resultWithDetail
            .slice(0, limit)
            .map((anime: AnimeDetail) => convertToMd(anime));
          footerTable = resultWithDetail
            .slice(0, limit)
            .map((anime: AnimeDetail) => convertToTableRow(anime))
            .join('');
        }

        const calendarJson = {
          table: {
            headers: ['月', '火', '水', '木', '金', '土', '日'],
            rows: [['評価', '人気', '映画', '評価', '人気', '映画', '期待']],
          },
        };

        let articleContent = `
    \n\n## Top${graphSize} (${today} ${now})
    \n\n${graphHtml}
    \n\n差をわかりやすくするため、${graphSize + 1}位のアニメを基準に、相対的にグラフを作っています。
    \n\n- 視聴者数: まだ見終わってない人も含みます
    \n- スコア: 10点満点の加重平均です。計算方法は[こちら](https://myanimelist.net/info.php?go=topanime)
    \n\n${json2md(calendarJson)}
    \n\n作成日時${today}、${now}
    <span></span>
    <style>.graphBox{font-size:0.8em;width:100%;display:flex;padding:.3em;margin:0 0 .2em;position:relative}
    .graphBox>.title{overflow:visible;white-space:nowrap;background:#add8e6;font-weight:700;padding:.3em}
    .graphBox>.rightnumber{font-weight:bold;color:gray;position:absolute;right:.3em;padding:.3em}</style>
    <span></span>
    \n\n${json2md(dataJson)}
    \n## Excel処理用データ\n\n| タイトル | カウント |\n| :--- | ---: |\n${footerTable}
    \n\n
    \n\n===
    \n\nこのランキングは、MyAnimeListの非公式API「Jikan」を使用し、毎日自動で生成しています。詳しくは以下のソースコードをご覧ください。
    \n\n[レポジトリ](https://github.com/aelyone/guranimefu)
    \n\nなお、送信にGCPとMailjetを使っているので、それらに障害が発生した場合は投稿されません。
    \n\n===\n\nsource: [MyAnimeList](https://myanimelist.net/topanime.php?type=${hatenaMode}) / Created at ${today}, ${now}
    \n\n
    `;

        let articleTitle: string = '';
        if (hatenaMode == 'bypopularity') {
          articleTitle = `${today}の、世界アニメ人気ランキングTop${limit}。1位は${
            firstAnime.title_japanese ?? ''
          }(${firstAnime.members ?? 0}人視聴)`;
        }
        if (hatenaMode == 'upcoming') {
          articleTitle = `${today}時点で、世界が期待するアニメTop${limit}。1位は${
            firstAnime.title_japanese ?? ''
          }(${firstAnime.members ?? 0}人視聴予定)`;
        }
        if (hatenaMode == 'movie') {
          articleTitle = `${today}の、世界のアニメ映画評価ランキングTop${limit}。1位は${
            firstAnime.title_japanese ?? ''
          }(スコア${firstAnime.score ?? 0})`;
        }
        if (hatenaMode == 'byscore') {
          articleTitle = `${today}の、世界のアニメ評価ランキングTop${limit}。1位は${
            firstAnime.title_japanese ?? ''
          }(スコア${firstAnime.score ?? 0})`;
        }

        return {
          articleTitle,
          articleContent,
        };
      } else {
        return {
          articleTitle: 'エラー',
          articleContent: 'エラー: ' + JSON.stringify(resultWithDetail),
        };
      }
    })
    .catch((e) => {
      functions.logger.error(e);
      return {
        articleTitle: 'エラー',
        articleContent: 'エラー' + e,
      };
    });

  return content;
};

/* -------------------------
POST BY MAIL
---------------------------- */

export const postToHatenaBlog = async () => {
  let hatenaMode: HatenaMode = 'oyasumi';
  const date = new Date();
  const yobi = date.getDay();

  if (yobi == 1 || yobi == 4) {
    hatenaMode = 'byscore';
  }
  if (yobi == 3 || yobi == 6) {
    hatenaMode = 'movie';
  }
  if (yobi == 2 || yobi == 5) {
    hatenaMode = 'bypopularity';
  }
  if (yobi == 0) {
    hatenaMode = 'upcoming';
  }

  hatenaMode == 'oyasumi' ? console.log('今日はお休み') : console.log('Mode set: ' + hatenaMode);

  await generateArticle(hatenaMode)
    .then((articleData) => {
      let options = {
        title: articleData.articleTitle ?? '',
        content: articleData.articleContent,
        from: adminConfig.hatenablog.sender ?? 'cloudFunctions@aely.one',
        fromName: 'はてな投稿',
        to: adminConfig.hatenablog.to ?? 'sasigume+cloudFunctionsFailed@gmail.com',
      };
      console.log('Title: ' + articleData.articleTitle);

      MailJet(options);
    })
    .catch((e) => {
      functions.logger.error(e);
    });
};
