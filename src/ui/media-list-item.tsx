import { decodeHTML } from "entities";
import { Link, type RelativePathString } from "expo-router";
import { memo, type JSX } from "react";
import type { Song } from "src/models";
import { formatDuration, parsePath } from "src/utils";
import { Avatar, ListItem, SizableText, XStack } from "tamagui";

import { SongOptionsMenu } from "./song-options-menu";

export type MediaListItemData = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  perma_url: string;
  type?: string;
  more_info?: {
    duration?: string | number;
  };
};

export type MediaListItemProps = MediaListItemData & {
  trackNumber?: number;
  iconAfterOverride?: JSX.Element;
};

export const MediaListItem = memo(function MediaListItem({
  trackNumber,
  iconAfterOverride,
  ...song
}: MediaListItemProps) {
  const isArtistItem = song.type === "artist" || /\/artist\//i.test(song.perma_url);
  const duration = song.more_info?.duration
    ? formatDuration(Number(song.more_info.duration))
    : null;

  return (
    <XStack
      items="center"
      justify="space-between"
      width="100%"
      rounded="$3"
      hoverStyle={{ bg: "$color3" }}
      pressStyle={{ bg: "$color4", scale: 0.99 }}
    >
      <Link href={parsePath(song.perma_url) as RelativePathString} asChild style={{ flex: 1 }}>
        <ListItem
          flex={1}
          items="center"
          icon={
            <XStack items="center" gap="$2">
              {trackNumber !== undefined && (
                <SizableText size="$1" color="$color10" width={18} text="center" fontWeight="600">
                  {trackNumber < 10 ? `0${trackNumber}` : trackNumber}
                </SizableText>
              )}
              <Avatar size="$4" rounded={isArtistItem ? "$10" : "$2"}>
                <Avatar.Image src={song.image} />
                <Avatar.Fallback bg="$color4" rounded={isArtistItem ? "$10" : "$2"} />
              </Avatar>
            </XStack>
          }
          title={decodeHTML(song.title)}
          subTitle={decodeHTML(song.subtitle || "")}
          size="$3"
          py="$1"
          px="$2"
          bg="transparent"
          rounded="$3"
        />
      </Link>

      <XStack items="center" gap="$1.5" pr="$2">
        {iconAfterOverride !== undefined ? (
          iconAfterOverride
        ) : (
          <>
            {duration && (
              <SizableText size="$1" color="$color10" fontWeight="500">
                {duration}
              </SizableText>
            )}
            <SongOptionsMenu {...(song as Song)} />
          </>
        )}
      </XStack>
    </XStack>
  );
});
