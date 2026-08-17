import { Search as SearchIcon, X as ClearIcon } from "@tamagui/lucide-icons-2";
import type { RelativePathString } from "expo-router";
import { router, usePathname, Slot, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Form, Input, SizableText, XGroup, XStack, YStack } from "tamagui";

const tabs = [
  { label: "All", path: "" },
  { label: "Songs", path: "songs/" },
  { label: "Albums", path: "albums/" },
  { label: "Playlists", path: "playlists/" },
  { label: "Artists", path: "artists/" },
];

function gotoSearch(query: string, path?: string) {
  const trimmed = query.trim();
  if (trimmed) {
    router.navigate(`/search/${path ?? ""}${encodeURIComponent(trimmed)}` as RelativePathString);
  }
}

export default function SearchLayout() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [value, setValue] = useState(query);
  const pathname = usePathname();

  const currentTab = tabs.find((t) => t.path && pathname.includes(`/search/${t.path}`))?.path ?? "";

  return (
    <YStack flex={1} px="$3" bg="$background">
      <YStack gap="$2.5" mt="$2.5">
        <Form
          items="center"
          flexDirection="row"
          gap="$2"
          onSubmit={() => gotoSearch(value, currentTab)}
        >
          <XStack flex={1} position="relative" items="center">
            <Input
              flex={1}
              size="$4"
              value={value}
              onChangeText={setValue}
              rounded="$10"
              pr={value ? "$8" : "$3"}
              focusStyle={{ borderColor: "$blue10" }}
              enterKeyHint="search"
              onSubmitEditing={() => gotoSearch(value, currentTab)}
              placeholder="Search for music..."
            />
            {!!value && (
              <Button
                position="absolute"
                r="$2"
                chromeless
                circular
                size="$2"
                icon={ClearIcon}
                onPress={() => setValue("")}
              />
            )}
          </XStack>
          <Form.Trigger asChild>
            <Button size="$4" icon={SearchIcon} rounded="$10" bg="$color12" color="$color1" />
          </Form.Trigger>
        </Form>

        <XGroup width="100%" mb="$2">
          {tabs.map(({ label, path }) => {
            const isSelected = currentTab === path;
            return (
              <XGroup.Item key={label}>
                <Button
                  flex={1}
                  height="$2.5"
                  px="$1"
                  bg={isSelected ? "$blue10" : "$color3"}
                  borderColor={isSelected ? "$blue10" : "$borderColor"}
                  borderWidth={1}
                  pressStyle={{ scale: 0.98 }}
                  onPress={() => {
                    if (value.trim()) {
                      gotoSearch(value, path);
                    }
                  }}
                >
                  <SizableText
                    size="$1"
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? "white" : "$color11"}
                    numberOfLines={1}
                  >
                    {label}
                  </SizableText>
                </Button>
              </XGroup.Item>
            );
          })}
        </XGroup>
      </YStack>
      <Slot />
    </YStack>
  );
}
