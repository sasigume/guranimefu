import { Timestamp } from '@google-cloud/firestore';

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
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
    images: {
      image_url?: string; // 135x318
      small_image_url?: string;
      medium_image_url?: string;
      large_image_url?: string; // 424x600
      maximum_image_url?: string;
    };
  };
  title: string;
  title_english?: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to?: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day?: number;
        month?: number;
        year?: number;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: any;
  season?: string;
  year?: number;
  broadcast: Broadcast;
  producers: Producer[];
  licensors: Licensor[];
  studios: Studio[];
  genres: Genre[];
  lastFetched?: Timestamp;
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
