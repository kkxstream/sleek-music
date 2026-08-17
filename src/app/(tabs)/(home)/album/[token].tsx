import { Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { AlbumBase, AlbumDetailResponse } from "src/models";
import { ContentRails, HeroBanner, MediaListItem } from "src/ui";
import { apiFetcher, dedupArtists, durationOfList, toCapitalize } from "src/utils";
import useSWRImmutable from "swr/immutable";
import { ScrollView, Separator, SizableText, Spinner, XStack, YGroup, YStack } from "tamagui";

export default function AlbumPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading } = useSWRImmutable<AlbumDetailResponse>(
    ["album_detail", { token }],
    apiFetcher,
  );

  const { data: recommended } = useSWRImmutable<AlbumBase[]>(
    data?.modules?.reco?.source_params ? ["album_reco", data.modules.reco.source_params] : null,
    apiFetcher,
  );

  const { data: yearAlbums } = useSWRImmutable<AlbumBase[]>(
    data?.modules?.topAlbumsFromSameYear?.source_params
      ? ["year_albums", data.modules.topAlbumsFromSameYear.source_params]
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

  if (!data || error) {
    return <Redirect href={"/404" as RelativePathString} />;
  }

  const extras = [
    {
      id: "you-might-like",
      heading: "You might like",
      items: recommended,
    },
    {
      id: "from-same-year",
      heading: "From same year",
      items: yearAlbums,
    },
    {
      id: "all-artists",
      heading: "All Artists",
      items: dedupArtists(data.more_info.artistMap.artists || []),
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
        subtitle={data.subtitle}
        type="album"
        image={data.image}
        perma_url={data.perma_url}
        songs={data.list}
      >
        <XStack items="center" gap="$1.5">
          <SizableText size="$1" color="$color11">
            {data.year}
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {toCapitalize(data.language ?? "")} Album
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
