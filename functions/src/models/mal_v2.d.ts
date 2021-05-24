// blank means sort by score
export type Subtype = 'bypopularity' | 'byscore' | 'movie' | 'upcoming' | '';

// this determine which type of article will be posted
export type HatenaMode = 'bypopularity' | 'byscore' | 'movie' | 'upcoming' | 'oyasumi';
interface AnimeBase {
  mal_id: string;
  title?: string;
  url?: string;
  image_url?: string;
  type?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
}

export interface AnimeTop extends AnimeBase {
  start_date?: string;
  end_date?: string;
}

export interface AnimeDetail extends AnimeBase, AnimeTop {
  title_japanese?: string;
}

export interface AnimeOnFirebase {
  // updateTimeArray is back in v2!
  updateTimeArray: Pos[];
  cacheTtlOfRanking?: number;
  lastUpdateEnv?: string;
  lastUpdateTime?: string;
  start_date?: string;
  end_date?: string;
  mal_id: string;
  title?: string;
  title_japanese?: string;
  url?: string;
  image_url?: string;
  type?: string;
  score?: number;
  scored_by?: number;
  members?: number;
  favorites?: number;
  rankOfPopularity?: number;
  rankOfScore?: number;
  scoreArray?: Pos[];
  membersArray?: Pos[];
  rankOfScoreArray?: Pos[];
  rankOfPopularityArray?: Pos[];
  color?: string;
}

export type GraphType = 'line' | 'bump';

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
  gdsForBump: graphData[];
  gdsForLine: graphData[];
}

export type ConvertedForMultiGraph = {
  ignoredDates: string[];
  sampleLength: number;
  lastConverted: Date;
  byScore: DataForTwoGraph;
  byPopularity: DataForTwoGraph;
};

export interface NumberOfDate {
  [key: string]: number;
}

export interface AnimeForGraph {
  updateTimeArray: Pos[];
  cacheTtlOfRanking: number;
  lastUpdateEnv: string;
  lastUpdateTime: string;
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
  scoreArray: Pos[];
  membersArray: Pos[];
  rankOfScoreArray: Pos[];
  rankOfPopularityArray: Pos[];
  color: string;
}

export interface AnimeForGraphWithLastFetched extends AnimeForGraph {
  lastFetched?: string;
}

export interface AnimeForSingle extends AnimeForGraph {
  description: string;
  // BUMP graph doesn't make sense for single anime
  gdsForLinePop: graphData[];
  gdsForLineScore: graphData[];
}

export interface PreConvert {
  lastFetched: string;
  animesByPopularity: AnimeForGraph[];
  animesByScore: AnimeForGraph[];
}

export interface AnimeForRss {
  lastFetched: string;
  mal_id: string;
  title: string;
  description: string;
}
