export type Subtype = "byscore" | "bypopularity";

export type GraphType = "line" | "bump";

export interface Pos {
  x: string;
  y: number;
}

export type graphData = {
  id: string;
  data: Pos[];
  color: string;
};

export interface DataForTwoGraph {
  gdsForBump: graphData[] | void;
  gdsForLine: graphData[] | void;
}

export type ConvertedForMultiGraph =
  | {
      ignoredDates: string[];
      sampleLength: number;
      lastConverted: Date;
      byScore: DataForTwoGraph;
      byPopularity: DataForTwoGraph;
    }
  | Void;

export interface NumberOfDate {
  [key: string]: number;
}

export interface tsOfDate {
  [key: string]: firebase.firestore.Timestamp;
}

export interface AnimeForGraph {
  lastFetched?: string;
  cacheTtlOfRanking: number;
  lastUpdateEnv: string;
  lastUpdateTime: any;
  updateTimeArray?: tsOfDate[];
  start_date: string;
  end_date: string;
  mal_id: string;
  title: string;
  title_japanese: string;
  url: string;
  image_url: string;
  type: string;
  score: number;
  scored_by: number;
  members: number;
  favorites: number;
  rankOfPopularity: number;
  rankOfScore: number;
  scoreArray: numberOfDate[];
  membersArray: numberOfDate[];
  rankOfScoreArray: numberOfDate[];
  rankOfPopularityArray: numberOfDate[];
  color: string;
}

export interface AnimeForSingle extends AnimeForGraph {
  description: string;
  // BUMP graph doesn't make sense for single anime
  gdsForLinePop: graphData[];
  gdsForLineScore: graphData[];
}

export interface AnimeForRss {
  lastFetched: string;
  mal_id: string;
  title: string;
  description: string;
}
