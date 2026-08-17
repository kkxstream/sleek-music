import { Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { PlaylistBase, PlaylistDetailResponse } from "src/models";
import { ContentRails, HeroBanner, MediaListItem } from "src/ui";
import { apiFetcher, dedupArtists, durationOfList } from "src/utils";
import useSWR from "swr";
import { ScrollView, Separator, SizableText, Spinner, XStack, YGroup, YStack } from "tamagui";

export default function PlaylistPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading } = useSWR<PlaylistDetailResponse>(
    ["playlist_detail", { token }],
    apiFetcher,
  );
  const { data: recommended } = useSWR<PlaylistBase[]>(
    data?.modules?.relatedPlaylist?.source_params
      ? ["playlist_reco", data.modules.relatedPlaylist.source_params]
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

  if (error || !data) {
    return <Redirect href={"/404" as RelativePathString} />;
  }

  const extras = [
    {
      id: "you-might-like",
      heading: "You might like",
      items: recommended,
    },
    {
      id: "all-artists",
      heading: "All Artists",
      items: dedupArtists(data.more_info.artists || []),
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
        id={data.id}
        title={data.title}
        subtitle={data.header_desc}
        type="playlist"
        image={data.image}
        perma_url={data.perma_url}
        songs={data.list}
      >
        <XStack items="center" gap="$1.5">
          <SizableText size="$1" color="$color11">
            {data.subtitle}
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {data.list_count} Songs
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {durationOfList(data.list)}
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="$2" />
      <YGroup size="$4">
        {data.list.map((song, index) => (
          <YGroup.Item key={song.id}>
            <MediaListItem {...song} trackNumber={index + 1} />
          </YGroup.Item>
        ))}
      </YGroup>
      <Separator my="$2" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}
