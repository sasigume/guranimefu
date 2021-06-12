import { AnimeOnFirebase, Subtype, graphData, Pos } from '../../models/mal_v4';
import dayjs from 'dayjs';

// Conver data into the structure shown below URL
// https://nivo.rocks/bump/

/* ---------------------------
  // IMPORTANT: SORT AND REMOVE DUPLICATED DATA
  // https://stackoverflow.com/a/60716511/15161394
  // https://stackoverflow.com/a/60737337/15161394
  ------------------------------*/

const optimizePos = (graphData?: graphData) => {
  if (graphData) {
    let posWithoutDuplicate: any = {};
    for (let item of graphData.data) {
      posWithoutDuplicate[item.x] = item;
    }
    const datasWithoutDuplicate = Object.values(posWithoutDuplicate) as any;

    return datasWithoutDuplicate.sort((a: Pos, b: Pos) =>
      dayjs(a.x).toDate() < dayjs(b.x).toDate()
        ? -1
        : dayjs(b.x).toDate() > dayjs(a.x).toDate()
        ? 1
        : 0,
    );
  } else return [] as Pos[];
};

interface GDProps {
  animes: AnimeOnFirebase[];
  mode: Subtype;
}

type ReturnGD = ({ animes, mode }: GDProps) => graphData[];

export const GraphDatasForLine: ReturnGD = ({ animes, mode }: GDProps) => {
  return animes.map((anime) => {
    let array = anime.chart_line_score;

    if (mode == 'bypopularity') {
      array = anime.chart_line_popularity;
    }

    return { ...array, data: optimizePos(array) } as graphData;
  });
};

export const GraphDatasForBump: ReturnGD = ({ animes, mode }: GDProps) => {
  return animes.map((anime) => {
    let array = anime.chart_bump_score;
    if (mode == 'bypopularity') {
      array = anime.chart_bump_popularity;
    }

    return { ...array, data: optimizePos(array) } as graphData;
  });
};
