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
  chart_line_score?: graphData;
  chart_line_popularity?: graphData;
  chart_bump_score?: graphData;
  chart_bump_popularity?: graphData;
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
  label: string;
  color: string;
};

export interface DataForTwoGraph {
  gdsForBump: graphData[];
  gdsForLine: graphData[];
}

export type ConvertedForMultiGraph = {
  sampleLength: number;
  lastConverted: Date;
  byScore: DataForTwoGraph;
  byPopularity: DataForTwoGraph;
  allAnimes: AnimeForGraph[];
};

export interface NumberOfDate {
  [key: string]: number;
}

export interface AnimeForGraph {
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
  chart_line_score: graphData;
  chart_line_popularity: graphData;
  chart_bump_score: graphData;
  chart_bump_popularity: graphData;
  color: string;
}

export interface AnimeForGraphWithLastFetched extends AnimeForGraph {
  lastFetched?: any;
}

export interface AnimeForSingle extends AnimeForGraph {
  description: string;
}

export interface PreConvert {
  lastFetched: any;
  animesByPopularity: AnimeForGraph[];
  animesByScore: AnimeForGraph[];
}

export interface AnimeForRss {
  lastFetched: string;
  mal_id: string;
  title: string;
  description: string;
}
