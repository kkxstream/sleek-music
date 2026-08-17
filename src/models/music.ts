import type { Language, MediaType, Module } from "./common";

export interface ArtistBase {
  id: string;
  name: string;
  role?: string;
  image?: string;
  type: MediaType.Artist;
  perma_url: string;
}

export interface ArtistMap {
  primary_artists: ArtistBase[];
  featured_artists: ArtistBase[];
  artists: ArtistBase[];
}

export interface ArtistOverviewResponse {
  artistId: string;
  name: string;
  subtitle: string;
  image: string;
  follower_count: string;
  type: MediaType.Artist;
  isVerified: boolean;
  dominantLanguage: Language;
  dominantType: string;
  topSongs: Song[];
  topAlbums: AlbumResult[];
  dedicated_artist_playlist: PlaylistResult[];
  featured_artist_playlist: PlaylistResult[];
  singles: AlbumResult[];
  latest_release: AlbumResult[];
  similarArtists: ArtistBase[];
  isRadioPresent: true;
  bio: "[]";
  dob?: "";
  fb: string;
  twitter: string;
  wiki: string;
  urls: {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
  };
  availableLanguages: Language[];
  fan_count: string;
  topEpisodes: unknown[];
  is_followed: boolean;
  modules: {
    topSongs: Module;
    latest_release: Module;
    topAlbums: Module;
    dedicated_artist_playlist: Module;
    featured_artist_playlist: Module;
    singles: Module;
  };
}

export interface ArtistResult extends ArtistBase {
  ctr: number;
  entity: number;
  image: string;
  role: string;
  mini_obj: boolean;
  isRadioPresent: boolean;
  is_followed: boolean;
}

export interface AlbumBase {
  id: string;
  title: string;
  subtitle?: string;
  header_desc?: string;
  type: MediaType.Album;
  perma_url: string;
  image: string;
  language: Language;
  year?: string;
  play_count?: string;
  explicit_content: "0" | "1";
  list_count?: string;
  list_type?: MediaType.Song;
  list?: "";
  more_info: BaseAlbumMoreInfo;
  modules?: null;
  button_tooltip_info: unknown[];
}

interface BaseAlbumMoreInfo {
  release_date: string;
  song_count: string;
  artistMap: ArtistMap;
}

export interface AlbumReco extends Omit<AlbumBase, "language" | "more_info"> {
  language?: string;
  more_info: {
    mini_obj: "true" | "false";
  };
}

export interface AlbumDetailResponse extends Omit<AlbumBase, "modules" | "list" | "more_info"> {
  list: Song[];
  more_info: AlbumDetailMoreInfo;
  modules: AlbumDetailModules;
}

interface AlbumDetailMoreInfo {
  song_count: string;
  artistMap: ArtistMap;
  copyright_text: string;
  is_dolby_content: boolean;
  label_url: string;
}

interface AlbumDetailModules {
  list: Module;
  reco: Module<{ albumid: string }>;
  currentlyTrending: Module<{
    entity_type: MediaType.Album;
    entity_language: Language;
  }>;
  topAlbumsFromSameYear: Module<{
    album_year: string;
    album_lang: Language;
  }>;
  artists: Module;
}

export interface AlbumResult extends Omit<AlbumBase, "modules" | "more_info"> {
  more_info: ResultAlbumMoreInfo;
}

interface ResultAlbumMoreInfo {
  query: string;
  text: string;
  music: string;
  song_count: string;
  artistMap: ArtistMap;
}

export interface Song {
  id: string;
  title: string;
  subtitle: string;
  header_desc?: string;
  type: MediaType.Song;
  perma_url: string;
  image: string;
  language: Language;
  year: string;
  play_count: string;
  explicit_content: "0" | "1";
  list_count: string;
  list_type?: string;
  list?: string;
  more_info: ListSongMoreInfo;
  modules?: null;
  button_tooltip_info: unknown[];
}

interface ListSongMoreInfo {
  music: string;
  album_id: string;
  album: string;
  label: string;
  label_id: string;
  origin: Origin;
  is_dolby_content: boolean;
  "320kbps": string;
  encrypted_media_url: string;
  encrypted_cache_url?: string;
  encrypted_drm_cache_url?: string;
  encrypted_drm_media_url: string;
  album_url: string;
  duration: string;
  rights: Rights;
  cache_state: "true" | "false";
  has_lyrics: "true" | "false";
  lyrics_snippet: string;
  starred: "true" | "false";
  copyright_text: string;
  artistMap: ArtistMap;
  release_date: string;
  label_url?: string;
  vcode: string;
  vlink: string;
  triller_available: boolean;
  request_jiotune_flag: boolean;
  webp: "true" | "false";
  lyrics_id?: string;
}

enum Origin {
  None = "none",
  Playlist = "playlist",
  Album = "album",
  Artist = "artist",
}

interface Rights {
  code: string;
  cacheable: "true" | "false";
  delete_cached_object: "true" | "false";
  reason?: string;
}

export interface SongDetailResponse {
  songs: [Song];
  modules: SongDetailModules;
}

interface SongDetailModules {
  reco: Module<{
    pid: string;
    language: Language;
  }>;
  currentlyTrending: Module<{
    entity_type: MediaType.Song;
    entity_language: Language;
  }>;
  songsBysameArtists: Module<{
    artist_ids: string;
    song_id: string;
    language: Language;
  }>;
  songsBysameActors: Module<{
    actor_ids: string;
    song_id: string;
    language: Language;
  }>;
  artists: Module;
}

export interface PlaylistBase {
  id: string;
  title: string;
  subtitle: string;
  header_desc?: string;
  type: MediaType.Playlist;
  perma_url: string;
  image: string;
  language?: Language;
  year?: string;
  play_count?: string;
  explicit_content: "0" | "1";
  list_count: string;
  list_type?: string;
  list?: [];
  more_info: PlaylistMoreInfo;
  modules?: null;
  button_tooltip_info: unknown[];
}

interface PlaylistMoreInfo {
  listid: string;
  isWeekly: "true" | "false";
  listname: string;
  firstname: string;
  song_count: string;
  follower_count: string;
  fan_count: string;
}

export interface PlaylistTop {
  id: string;
  title: string;
  subtitle: string;
  type: MediaType.Playlist;
  image: string;
  perma_url: string;
  explicit_content: "0" | "1";
  more_info: TopPlaylistMoreInfo;
  mini_obj: boolean;
}

interface TopPlaylistMoreInfo {
  song_count: string;
  firstname: string | "JioSaavn";
  follower_count: string;
  last_updated: string;
  uid: string | "phulki_user";
}

export interface PlaylistChart {
  id: string;
  image: string;
  title: string;
  type: MediaType.Playlist;
  count: number;
  perma_url: string;
  more_info: ChartMoreInfo;
}

interface ChartMoreInfo {
  firstname: "JioSaavn";
}

export interface PlaylistReco extends Omit<PlaylistTop, "more_info"> {
  more_info: ChartMoreInfo;
}

export interface MixBase {
  id: string;
  title: string;
  subtitle?: string;
  header_desc?: string;
  type: MediaType.Mix;
  perma_url: string;
  image: string;
  language?: Language;
  year?: string;
  play_count?: string;
  explicit_content: "0" | "1";
  list_count: string;
  list_type?: string;
  list?: [];
  more_info: BaseMixMoreInfo;
  button_tooltip_info: unknown[];
  description?: null;
}

interface BaseMixMoreInfo {
  firstname: string;
  lastname: string;
  type: MediaType.Mix;
}

export interface PlaylistDetailResponse extends Omit<
  PlaylistBase,
  "modules" | "list" | "more_info"
> {
  list: Song[];
  more_info: PlaylistDetailMoreInfo;
  modules: PlaylistDetailModules;
}

interface PlaylistDetailMoreInfo {
  uid: string | "phulki_user";
  contents: string;
  is_dolby_content: boolean;
  subtype: unknown[];
  last_updated: string;
  username: string;
  firstname: string;
  lastname: string;
  is_followed: "true" | "false";
  isFY: boolean;
  follower_count: string;
  fan_count: string;
  playlist_type: string;
  share: string;
  sub_types: unknown[];
  images: unknown[];
  H2: string | null;
  subheading: string | null;
  video_count: string;
  artists: ArtistBase[];
  subtitle_desc: [string, string, string]; // duration, Count Songs, Number Fans
}

interface PlaylistDetailModules {
  list: Module;
  relatedPlaylist: Module<{ listid: string }>;
  currentlyTrendingPlaylists: Module<{
    entity_type: MediaType.Playlist;
    entity_language: Language;
  }>;
  artists: Module;
}

export interface MixDetailResponse extends Omit<MixBase, "modules" | "list" | "more_info"> {
  header_desc: string;
  list: Song[];
  more_info: MixDetailMoreInfo;
  modules: MixDetailModules;
}

interface MixDetailMoreInfo {
  uid?: null;
  last_updated: string;
  username: null;
  firstname: string;
  lastname: string;
  is_followed?: "true" | "false";
  playlist_type: MediaType.Mix;
  share: string;
}

interface MixDetailModules {
  list: Module;
}

export interface PlaylistFeaturedResponse {
  data: PlaylistTop[];
  count: number;
  last_page: boolean;
}

export interface PlaylistResult extends Omit<PlaylistTop, "more_info"> {
  numsongs: null;
  more_info: ResultPlaylistMoreInfo;
}

interface ResultPlaylistMoreInfo {
  uid: string;
  firstname: string | "JioSaavn";
  artist_name?: [string];
  entity_type: MediaType.Playlist;
  entity_sub_type?: string;
  video_available: boolean;
  is_dolby_content: null;
  sub_types: null;
  images: null;
  lastname: "Editor" | string;
  song_count: string;
  language: Language;
}

export interface ChannelBase {
  id: string;
  title: string;
  subtitle?: string;
  type: MediaType.Channel;
  image: string;
  perma_url: string;
  more_info: BaseChannelMoreInfo;
  explicit_content: "0" | "1";
  mini_obj: boolean;
}

interface BaseChannelMoreInfo {
  badge: string;
  sub_type: string;
  available: string;
  is_featured: string;
  tags: unknown[] | ChannelTags;
  video_url: string;
  video_thumbnail: string;
}

interface ChannelTags {
  mood?: string[];
  situation?: string[];
  seasonality?: string[];
  genre?: string[];
}

export interface Radio {
  id: string;
  title: string;
  subtitle: string;
  type: MediaType.Radio;
  image: string;
  perma_url: string;
  more_info: RadioMoreInfo;
  explicit_content: "0" | "1";
  mini_obj: boolean;
}

interface RadioMoreInfo {
  description: string;
  featured_station_type: "featured";
  query?: string;
  color: string;
  language: Language;
  station_display_text: string;
}

export interface RadioArtistReco {
  id: string;
  title: string;
  subtitle: string;
  type: MediaType.Radio;
  image: string;
  perma_url: string;
  more_info: ArtistRecoMoreInfo;
  explicit_content: "0" | "1";
  mini_obj: boolean;
}

interface ArtistRecoMoreInfo {
  featured_station_type: "featured";
  query: string;
  station_display_text: string;
}

export interface LyricsResponse {
  lyrics: string;
  lyrics_copyright: string;
  script_tracking_url: string;
  snippet: string;
}

export interface EntityStationResponse {
  stationid: string;
  error?: string;
}

export interface RadioSongItem {
  song: Song;
}

export interface RadioSongsResponse {
  stationid?: string;
  error?: string;
  [key: string]: RadioSongItem | string | undefined;
}
