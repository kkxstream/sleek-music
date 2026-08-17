import {
  Heart as HeartOffIcon,
  LayoutGrid as GridIcon,
  List as ListIcon,
  Search as SearchIcon,
  X as ClearIcon,
} from "@tamagui/lucide-icons-2";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo, useState } from "react";
import { toggleFavourite, useGetFavourites } from "src/db";
import type { FavouriteItem } from "src/models";
import { GridView, MediaCard, MediaListItem } from "src/ui";
import { groupBy, toCapitalize } from "src/utils";
import {
  Button,
  H4,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

const FAVOURITE_TABS = ["song", "album", "playlist", "artist"] as const;
type FavouriteTab = (typeof FAVOURITE_TABS)[number];

export default function FavouritesPage() {
  const [currentTab, setCurrentTab] = useState<FavouriteTab>("song");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const { items, isLoading } = useGetFavourites();
  const db = useSQLiteContext();
  const data = useMemo(() => groupBy(items, (item: FavouriteItem) => item.type), [items]);

  if (isLoading) {
    return (
      <YStack bg="$background" flex={1} items="center" justify="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background" px="$3" pt="$2">
      <XStack items="center" gap="$2" mb="$2">
        <XStack
          flex={1}
          items="center"
          bg="$color2"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$10"
          px="$2.5"
          gap="$2"
          focusWithinStyle={{ borderColor: "$blue10" }}
        >
          <SearchIcon size={14} color="$color10" />
          <Input
            flex={1}
            size="$3"
            unstyled
            bg="transparent"
            placeholder={`Filter ${currentTab}s...`}
            placeholderTextColor="$color10"
            value={searchQuery}
            onChangeText={setSearchQuery}
            color="$color12"
          />
          {Boolean(searchQuery) && (
            <Button
              chromeless
              circular
              size="$2"
              icon={ClearIcon}
              color="$color10"
              hoverStyle={{ opacity: 0.8 }}
              onPress={() => setSearchQuery("")}
            />
          )}
        </XStack>

        <Button
          size="$3"
          circular
          chromeless
          icon={isGridView ? ListIcon : GridIcon}
          color="$color11"
          hoverStyle={{ bg: "$color3" }}
          pressStyle={{ scale: 0.92 }}
          onPress={() => setIsGridView((prev) => !prev)}
        />
      </XStack>

      <Tabs
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val as FavouriteTab)}
        orientation="horizontal"
        flexDirection="column"
        flex={1}
        borderColor="$borderColor"
      >
        <Tabs.List justifyContent="space-around" bg="$background" gap="$1.5">
          {FAVOURITE_TABS.map((tab) => {
            const count = (data[tab] || []).length;
            const isSelected = currentTab === tab;
            return (
              <Tabs.Tab
                key={tab}
                value={tab}
                size="$2.5"
                rounded="$10"
                px="$3"
                bg={isSelected ? "$blue10" : "$color3"}
                borderColor={isSelected ? "$blue10" : "$borderColor"}
                borderWidth={1}
                pressStyle={{ opacity: 0.85 }}
                hoverStyle={{ bg: isSelected ? "$blue11" : "$color4" }}
              >
                <SizableText
                  size="$1"
                  fontWeight={isSelected ? "700" : "500"}
                  color={isSelected ? "white" : "$color12"}
                >
                  {toCapitalize(tab) + "s" + (count > 0 ? ` (${count})` : "")}
                </SizableText>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        <Separator my="$1.5" />

        {FAVOURITE_TABS.map((type) => {
          const typeItems = data[type] || [];
          const filteredItems = searchQuery.trim()
            ? typeItems.filter((item) => {
                const query = searchQuery.toLowerCase();
                return (
                  item.title?.toLowerCase().includes(query) ||
                  item.subtitle?.toLowerCase().includes(query)
                );
              })
            : typeItems;

          return (
            <Tabs.Content key={type} value={type} flex={1}>
              {filteredItems.length > 0 ? (
                isGridView ? (
                  <GridView>
                    {filteredItems.map((item) => (
                      <MediaCard
                        key={item.id}
                        title={item.title}
                        subtitle={item.subtitle}
                        image={item.image}
                        perma_url={item.perma_url}
                        circle={type === "artist"}
                      />
                    ))}
                  </GridView>
                ) : (
                  <ScrollView
                    flex={1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ pb: 120 }}
                  >
                    <YGroup size="$4" bg="transparent">
                      {filteredItems.map((item, index) => (
                        <YGroup.Item key={item.id}>
                          <MediaListItem
                            {...item}
                            trackNumber={index + 1}
                            iconAfterOverride=<Button
                              chromeless
                              circular
                              size="$3"
                              icon=<HeartOffIcon size={18} color="$blue10" />
                              hoverStyle={{ bg: "$color4" }}
                              pressStyle={{ scale: 0.9 }}
                              onPress={async (e) => {
                                e.stopPropagation();
                                await toggleFavourite(db, item);
                              }}
                            />
                          />
                        </YGroup.Item>
                      ))}
                    </YGroup>
                  </ScrollView>
                )
              ) : (
                <YStack flex={1} items="center" justify="center" p="$4" gap="$2">
                  <HeartOffIcon size={36} color="$color9" />
                  <H4 fontSize="$3" fontWeight="600" color="$color12">
                    {searchQuery ? "No matches found" : `No favourite ${type}s`}
                  </H4>
                  <Paragraph size="$2" color="$color11" text="center">
                    {searchQuery
                      ? `No ${type}s matching "${searchQuery}"`
                      : `No favourite ${type}s added yet`}
                  </Paragraph>
                </YStack>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs>
    </YStack>
  );
}
