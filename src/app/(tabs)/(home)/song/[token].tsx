import TrackPlayer from "@rntp/player";
import { ListPlus as ListPlusIcon } from "@tamagui/lucide-icons-2";
import { Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { AlbumDetailResponse, Song, SongDetailResponse } from "src/models";
import { ContentRails, HeroBanner, MediaListItem } from "src/ui";
import { apiFetcher, createTrack, dedupArtists, formatDuration, prettifyNumber } from "src/utils";
import useSWRImmutable from "swr/immutable";
import {
  Button,
  H3,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

export default function SongPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading } = useSWRImmutable<SongDetailResponse>(
    ["song_detail", { token }],
    apiFetcher,
  );
  const song = data?.songs[0];

  const { data: album } = useSWRImmutable<AlbumDetailResponse>(
    song?.more_info?.album_url
      ? ["album_detail", { token: song.more_info.album_url.split("/").pop()! }]
      : null,
    apiFetcher,
  );

  const albumSongs = album?.list.filter((albumSong) => albumSong.id !== song?.id);

  const { data: recommended } = useSWRImmutable<Song[]>(
    data?.modules?.reco?.source_params ? ["song_reco", data.modules.reco.source_params] : null,
    apiFetcher,
  );

  const { data: actorSongs } = useSWRImmutable<Song[]>(
    data?.modules?.songsBysameActors?.source_params
      ? ["actor_songs", data.modules.songsBysameActors.source_params]
      : null,
    apiFetcher,
  );

  const { data: artistSongs } = useSWRImmutable<Song[]>(
    data?.modules?.songsBysameArtists?.source_params
      ? ["artist_songs", data.modules.songsBysameArtists.source_params]
      : null,
    apiFetcher,
  );

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error || !song) {
    return <Redirect href={"/404" as RelativePathString} />;
  }

  const extras = [
    {
      id: "you-might-like",
      heading: "You might like",
      items: recommended,
      more: <AddAllButton songs={recommended} />,
    },
    {
      id: "from-same-artists",
      heading: "From same artists",
      items: artistSongs,
      more: <AddAllButton songs={artistSongs} />,
    },
    {
      id: "from-same-actors",
      heading: "From same actors",
      items: actorSongs,
      more: <AddAllButton songs={actorSongs} />,
    },
    {
      id: "artists-and-actors",
      heading: "Artists & Actors",
      items: dedupArtists(song.more_info.artistMap.artists || []),
    },
  ];

  return (
    <ScrollView
      px="$3"
      contentContainerStyle={{ pb: 100 }}
      bg="$background"
      showsVerticalScrollIndicator={false}
    >
      <HeroBanner
        id={song.id}
        title={song.title}
        subtitle={song.subtitle}
        type="song"
        image={song.image}
        songs={data!.songs}
        perma_url={song.perma_url}
      >
        <XStack items="center" gap="$1.5">
          <SizableText size="$1" color="$color11">
            {song.year}
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {prettifyNumber(Number(song.play_count))} plays
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {formatDuration(Number(song.more_info.duration), "pretty")}
          </SizableText>
        </XStack>
      </HeroBanner>
      {!!albumSongs?.length && (
        <>
          <Separator my="$2" />
          <YStack>
            <XStack items="center" justify="space-between" mb="$1.5">
              <H3 fontSize="$4" fontWeight="700" $sm={{ fontSize: "$3" }}>
                From same album
              </H3>
              <AddAllButton songs={albumSongs} />
            </XStack>
            <YGroup size="$4">
              {albumSongs.map((albumSong, index) => (
                <YGroup.Item key={albumSong.id}>
                  <MediaListItem {...albumSong} trackNumber={index + 1} />
                </YGroup.Item>
              ))}
            </YGroup>
          </YStack>
        </>
      )}
      <Separator my="$2" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}

function AddAllButton({ songs }: { songs: Song[] | undefined }) {
  if (!songs?.length) {
    return undefined;
  }
  return (
    <Button
      size="$2"
      chromeless
      iconAfter={ListPlusIcon}
      color="$blue10"
      fontWeight="600"
      hoverStyle={{ opacity: 0.8 }}
      pressStyle={{ opacity: 0.7, scale: 0.97 }}
      onPress={() => {
        const tracks = songs.map(createTrack);
        TrackPlayer.addMediaItems(tracks);
      }}
    >
      Add all
    </Button>
  );
}
