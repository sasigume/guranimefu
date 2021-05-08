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
interface numberOfDate {
  [key: string]: number;
}
interface tsOfDate {
  [key: string]: any;
}

export interface AnimeOnFirebase {
  cacheTtlOfRanking?: number;
  lastUpdateEnv?: string;
  lastUpdateTime?: string;
  updateTimeArray?: tsOfDate[];
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
  scoreArray?: numberOfDate[];
  membersArray?: numberOfDate[];
  rankOfScoreArray?: numberOfDate[];
  rankOfPopularityArray?: numberOfDate[];
  color?: string;
}
