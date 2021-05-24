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

export type ConvertedForMultiGraph =
  | {
      sampleLength: number;
      lastConverted: Date;
      byScore: DataForTwoGraph;
      byPopularity: DataForTwoGraph;
    }
  | Void;

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
  chart_line_score?: graphData;
  chart_line_popularity?: graphData;
  chart_bump_score?: graphData;
  chart_bump_popularity?: graphData;
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
