import { AnimeForGraph, Subtype, graphData, Pos } from '../../models/mal_v2';
import dayjs from 'dayjs';

// Conver data into the structure shown below URL
// https://nivo.rocks/bump/

/* ---------------------------
  // IMPORTANT: SORT AND REMOVE DUPLICATED DATA
  // https://stackoverflow.com/a/60716511/15161394
  // https://stackoverflow.com/a/60737337/15161394
  ------------------------------*/

const optimizePos = (posArray: Pos[]) => {
  let posWithoutDuplicate: any = {};
  for (let item of posArray) {
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
};

interface GDProps {
  animes: AnimeForGraph[];
  mode: Subtype;
}

type ReturnGD = ({ animes, mode }: GDProps) => graphData[];

export const GraphDatasForLine: ReturnGD = ({ animes, mode }: GDProps) => {
  return animes.map((anime: AnimeForGraph) => {
    let array = anime.scoreArray;

    if (mode == 'bypopularity') {
      array = anime.membersArray;
    }

    return {
      id: `${anime.title_japanese}(ID:${anime.mal_id})`,
      data: optimizePos(array) as Pos[],
      color: anime.color ?? '#000',
    };
  });
};

export const GraphDatasForBump: ReturnGD = ({ animes, mode }: GDProps) => {
  return animes.map((anime: AnimeForGraph) => {
    let array = anime.scoreArray;
    if (mode == 'bypopularity') {
      array = anime.membersArray;
    }

    return {
      id: `${anime.title_japanese}(ID:${anime.mal_id})`,
      data: optimizePos(array) as Pos[],
      color: anime.color ?? '#000',
    };
  });
};
