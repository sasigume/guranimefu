import { AnimeDetail, AnimeTop } from '../../models/mal';
const Promise = require('bluebird');
const fetch = require('node-fetch');
/* -------------------------
GET DETAIL OF ANIME
---------------------------- */

export async function convertAnime(anime: AnimeTop) {
  // Avoiding api limit thanks to bluebird.js
  const getDetail = async (anime: AnimeTop) => {
    const resDetail = await fetch('https://api.jikan.moe/v3/anime/' + anime.mal_id);
    const detailData = (await resDetail.json()) as AnimeDetail;
    console.log(
      `Got detail of: %c ${detailData.title_japanese} (Score: ${anime.score})`,
      'font-weight:bold, color:green',
    );

    // Data is mixed because Jikan's return somehow differs depends on API type
    return {
      mal_id: anime.mal_id ?? 99999999,
      title: anime.title ?? '(エラー)',
      title_japanese: detailData.title_japanese ?? '(エラー)',
      url: anime.url ?? '',
      image_url: anime.image_url ?? '',
      type: anime.type ?? 'TV',
      score: anime.score ?? 0,
      start_date: anime.start_date ?? '(エラー)',
      end_date: anime.end_date ?? 'まだ終了していない',
      scored_by: detailData.scored_by ?? 0,
      rank: anime.rank ?? 0, // this field is for graph
      rankOfScore: detailData.rank ?? 0, // this field is always rank of 'score'
      rankOfPopularity: detailData.popularity ?? 0,
      members: anime.members ?? 0,
      favorites: detailData.favorites ?? 0,
    };
  };

  const result = new Promise((resolve: any) => {
    setTimeout(() => resolve(getDetail(anime)), 2500);
  });

  return result as AnimeDetail;
}
