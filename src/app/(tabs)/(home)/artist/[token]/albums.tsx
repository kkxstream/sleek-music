import { ArrowDown as ArrowDownIcon, ArrowUp as ArrowUpIcon } from "@tamagui/lucide-icons-2";
import { Redirect, type RelativePathString, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import type { ArtistOverviewResponse } from "src/models";
import { HeroBanner, MediaCard } from "src/ui";
import { apiFetcher, prettifyNumber, toCapitalize } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Button, Separator, SizableText, Spinner, XGroup, XStack, YStack } from "tamagui";

const FILTER_OPTIONS = [
  { label: "Popular", value: "", canSort: false, defaultOrder: "asc" as const },
  { label: "Date", value: "latest", canSort: true, defaultOrder: "desc" as const },
  { label: "Name", value: "alphabetical", canSort: true, defaultOrder: "asc" as const },
];

export default function ArtistAlbumsPage() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [category, setCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<ArtistOverviewResponse>(getKey, apiFetcher);

  function getKey(pageIndex: number, previousPageData: ArtistOverviewResponse | null) {
    if (previousPageData && !previousPageData.topAlbums.length) {
      return null;
    }
    const page = pageIndex + 1;
    return [
      "artist_overview",
      {
        token,
        p: page,
        n_song: 0,
        n_album: 20,
        sub_type: "albums",
        more: true,
        category,
        sort_order: sortOrder,
      },
    ];
  }

  const handleFilterPress = (option: (typeof FILTER_OPTIONS)[number]) => {
    if (category === option.value) {
      if (option.canSort) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      }
    } else {
      setCategory(option.value);
      setSortOrder(option.defaultOrder);
    }
  };

  const results = data?.flatMap((page) => page?.topAlbums ?? []) ?? [];
  const artist = data?.[0];

  const renderItem = useCallback(
    ({ item: album }: { item: ArtistOverviewResponse["topAlbums"][number] }) => (
      <MediaCard
        title={album.title}
        subtitle={album.subtitle}
        image={album.image}
        perma_url={album.perma_url}
      />
    ),
    [],
  );

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (!artist || error) {
    return <Redirect href={"/404" as RelativePathString} />;
  }

  return (
    <YStack flex={1} px="$3" bg="$background">
      <HeroBanner
        id={artist.artistId}
        title={artist.name}
        subtitle={artist.dominantType}
        type="artist"
        image={artist.image}
        showImage={false}
        perma_url={artist.urls.albums}
        songs={[]}
      >
        <XStack items="center" gap="$1.5">
          <SizableText size="$1" color="$color11">
            {toCapitalize(artist.dominantType)}
          </SizableText>
          <Separator vertical height={10} />
          <SizableText size="$1" color="$color11">
            {prettifyNumber(Number(artist.fan_count))} Listeners
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="$2" />
      <XGroup mb="$2" width="100%">
        {FILTER_OPTIONS.map((opt) => {
          const isSelected = category === opt.value;
          const OrderIcon = sortOrder === "asc" ? ArrowUpIcon : ArrowDownIcon;
          return (
            <XGroup.Item key={opt.value}>
              <Button
                flex={1}
                height="$2.5"
                bg={isSelected ? "$blue10" : "$color3"}
                borderColor={isSelected ? "$blue10" : "$borderColor"}
                borderWidth={1}
                pressStyle={{ scale: 0.98 }}
                onPress={() => handleFilterPress(opt)}
              >
                <XStack items="center" justify="center" gap="$1">
                  <SizableText
                    size="$1"
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? "white" : "$color11"}
                  >
                    {opt.label}
                  </SizableText>
                  {isSelected && opt.canSort && (
                    <OrderIcon size={13} color="white" strokeWidth={2.5} />
                  )}
                </XStack>
              </Button>
            </XGroup.Item>
          );
        })}
      </XGroup>
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
          gap: 12,
        }}
        renderItem={renderItem}
        onEndReached={() => setSize(size + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isValidating && results.length > 0 ? (
            <YStack items="center" py="$3">
              <Spinner size="large" color="$blue10" />
            </YStack>
          ) : null
        }
      />
    </YStack>
  );
}
