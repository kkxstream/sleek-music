import type { LatestDataResponse, LaunchDataResponse, TrendingItem } from "./home";
import type {
  AlbumDetailResponse,
  ArtistOverviewResponse,
  EntityStationResponse,
  LyricsResponse,
  MixDetailResponse,
  PlaylistDetailResponse,
  PlaylistFeaturedResponse,
  RadioSongsResponse,
  SongDetailResponse,
  Song,
  AlbumBase,
  PlaylistBase,
} from "./music";
import type {
  AutoSearchResponse,
  SearchAlbumResponse,
  SearchArtistResponse,
  SearchPlaylistResponse,
  SearchSongResponse,
} from "./search";

export interface APIEndpoints {
  song_detail: SongDetailResponse;
  song_reco: Song[];
  artist_songs: Song[];
  actor_songs: Song[];
  song_lyrics: LyricsResponse;
  album_detail: AlbumDetailResponse;
  album_reco: AlbumBase[];
  year_albums: AlbumBase[];
  artist_overview: ArtistOverviewResponse;
  playlist_detail: PlaylistDetailResponse;
  playlist_reco: PlaylistBase[];
  mix_detail: MixDetailResponse;
  launch_data: LaunchDataResponse;
  featured_playlists: PlaylistFeaturedResponse;
  latest_data: LatestDataResponse;
  trending_data: TrendingItem[];
  top_searches: TrendingItem[];
  auto_search: AutoSearchResponse;
  song_search: SearchSongResponse;
  album_search: SearchAlbumResponse;
  playlist_search: SearchPlaylistResponse;
  artist_search: SearchArtistResponse;
  entity_station: EntityStationResponse;
  radio_songs: RadioSongsResponse;
}
