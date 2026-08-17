import type { Module } from "./common";
import type {
  AlbumBase,
  ChannelBase,
  MixBase,
  PlaylistBase,
  PlaylistChart,
  PlaylistTop,
  RadioArtistReco,
  Radio,
  Song,
} from "./music";

type PromoVXData = {
  [key in `promo:vx:data:${string}`]?: unknown[];
};

export interface LaunchDataResponse extends PromoVXData {
  history: unknown[];
  new_trending: TrendingItem[];
  top_playlists: PlaylistTop[];
  new_albums: NewItem[];
  browse_discover: ChannelBase[];
  global_config: GlobalConfig;
  charts: PlaylistChart[];
  radio: Radio[];
  artist_recos: RadioArtistReco[];
  tag_mixes: MixBase[];
  modules: LaunchDataModules;
}

export type TrendingItem = Song | AlbumBase | PlaylistBase;
export type NewItem = Song | AlbumBase;

interface GlobalConfig {
  weekly_top_songs_listid: { [Language: string]: WeeklyTopSong };
  random_songs_listid: { [Language: string]: WeeklyTopSong };
  phn_otp_providers: { string: string };
}

interface WeeklyTopSong {
  listid: string;
  image: string;
  title: string;
  count: number;
}

type PromoVxModule = {
  [key in `promo:vx:data:${string}`]?: Module;
};

export interface LaunchDataModules extends PromoVxModule {
  history: unknown[];
  new_trending: Module;
  top_playlists: Module;
  new_albums: Module;
  browse_discover: Module;
  global_config: Module;
  charts: Module;
  radio: Module;
  artist_recos: Module;
  tag_mixes: Module;
}

export interface LatestDataResponse {
  data: NewItem[];
}
