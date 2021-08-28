export type Subtype = 'byscore' | 'bypopularity';

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

export interface ConvertedForMultiGraph {
  sampleLength: number;
  lastConverted: Date;
  byScore: DataForTwoGraph;
  allAnimes: AnimeForGraph[];
}

export interface AnimeForGraph {
  lastFetched?: string;
  cacheTtlOfRanking: number;
  lastUpdateEnv: string;
  lastUpdateTime: any;
  updateTimeArray?: Pos[];
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
  chart_bump_score: graphData;
  color: string;
}

export interface AnimeForSingle extends AnimeForGraph {
  description: string;
}

export interface AnimeForRss {
  lastFetched: string;
  mal_id: string;
  title: string;
  description: string;
}
