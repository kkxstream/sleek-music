import { ArrowRight as ArrowRightIcon } from "@tamagui/lucide-icons-2";
import { Link, Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import type { ArtistOverviewResponse } from "src/models";
import { ContentRails, HeroBanner, MediaCard, MediaListItem } from "src/ui";
import { apiFetcher, prettifyNumber, toCapitalize } from "src/utils";
import useSWR from "swr";
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

export default function ArtistOverviewPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading } = useSWR<ArtistOverviewResponse>(
    ["artist_overview", { token, p: 0, n_song: 10, n_album: 10 }],
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
      id: "just-artist",
      heading: `Just ${data.name.split(" ")[0]}`,
      items: data.dedicated_artist_playlist,
    },
    {
      id: "featured-in",
      heading: "Featured In",
      items: data.featured_artist_playlist,
    },
    {
      id: "top-singles",
      heading: "Top Singles",
      items: data.singles,
    },
    {
      id: "new-releases",
      heading: "New Releases",
      items: data.latest_release,
    },
    {
      id: "similar-artists",
      heading: "Similar Artists",
      items: data.similarArtists,
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
        id={data.artistId}
        title={data.name!}
        subtitle={data.dominantType}
        type="artist"
        image={data.image!}
        songs={data.topSongs}
        perma_url={data.urls.overview!}
      >
        <XStack items="center" gap="$1.5">
          <SizableText size="$1" color="$color11">
            {toCapitalize(data.dominantType)}
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {prettifyNumber(Number(data.fan_count))} Listeners
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="$2" />

      <YStack>
        <XStack gap="$2" justify="space-between" items="center" mb="$1.5">
          <H3 fontSize="$4" fontWeight="700" $sm={{ fontSize: "$3" }}>
            Top Songs
          </H3>
          <Link href={`/artist/${token}/songs` as RelativePathString} asChild>
            <Button
              size="$2"
              chromeless
              iconAfter={ArrowRightIcon}
              color="$blue10"
              fontWeight="600"
              hoverStyle={{ opacity: 0.8 }}
              pressStyle={{ opacity: 0.7 }}
            >
              View more
            </Button>
          </Link>
        </XStack>
        <YGroup size="$4">
          {data.topSongs.map((song, index) => (
            <YGroup.Item key={song.id}>
              <MediaListItem {...song} trackNumber={index + 1} />
            </YGroup.Item>
          ))}
        </YGroup>
      </YStack>

      {!!data.topAlbums.length && (
        <>
          <Separator my="$2" />
          <YStack>
            <XStack gap="$2" justify="space-between" items="center" mb="$1.5">
              <H3 fontSize="$4" fontWeight="700" $sm={{ fontSize: "$3" }}>
                Top Albums
              </H3>
              <Link href={`/artist/${token}/albums` as RelativePathString} asChild>
                <Button
                  size="$2"
                  chromeless
                  iconAfter={ArrowRightIcon}
                  color="$blue10"
                  fontWeight="600"
                  hoverStyle={{ opacity: 0.8 }}
                  pressStyle={{ opacity: 0.7 }}
                >
                  View more
                </Button>
              </Link>
            </XStack>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              mb="$1.5"
              contentContainerStyle={{
                gap: "$2.5",
                pr: "$2.5",
              }}
            >
              {data.topAlbums.map((album) => (
                <MediaCard
                  key={album.id}
                  title={album.title}
                  subtitle={album.subtitle}
                  image={album.image}
                  perma_url={album.perma_url}
                />
              ))}
            </ScrollView>
          </YStack>
        </>
      )}
      <Separator my="$2" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}
