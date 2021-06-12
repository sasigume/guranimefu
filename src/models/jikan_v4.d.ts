// 2021-06-12 Started collecting Jikan v4 data
// https://docs.api.jikan.moe/

// blank means sort by score
export type Subtype = "bypopularity" | "byscore" | "movie" | "upcoming" | "";

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

export interface Producer {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Broadcast {
  day?: string;
  time?: string;
  timezone?: string;
  string?: string;
}

export interface Licensor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Studio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeTop {
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
      image_url?: string;
      small_image_url?: string;
      medium_image_url?: string;
      large_image_url?: string;
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
}

export interface TopApiResponse {
  pagination: Pagination;
  data: AnimeTop[];
}

export interface AnimeWithColor extends AnimeTop {
  color?: string;
  mal_id_string: string;
}

export interface AnimeOnFirebase extends AnimeWithColor {
  lastUpdateEnv?: string;
  lastUpdateTime?: string;
  chart_line_score?: graphData;
  chart_line_popularity?: graphData;
  chart_bump_score?: graphData;
  chart_bump_popularity?: graphData;
}

export type GraphType = "line" | "bump";

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
  gdsForBump?: graphData[];
  gdsForLine?: graphData[];
}
export type ConvertedForMultiGraph = {
  sampleLength: number;
  lastConverted: Date;
  byScore: DataForTwoGraph;
  allAnimes: AnimeOnFirebase[];
};

export interface NumberOfDate {
  [key: string]: number;
}

export interface AnimeForGraphWithLastFetched extends AnimeOnFirebase {
  lastFetched?: any;
}

export interface AnimeForSingle extends AnimeForGraphWithLastFetched {
  description: string;
}

export interface PreConvertV4 {
  lastFetched: any;
  animesByScore: AnimeOnFirebase[];
}

export interface AnimeForRss {
  lastFetched: string;
  mal_id: string;
  title: string;
  description: string;
}
