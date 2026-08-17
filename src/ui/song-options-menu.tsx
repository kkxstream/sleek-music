import TrackPlayer from "@rntp/player";
import {
  Heart as HeartOffIcon,
  HeartPlus as HeartPlusIcon,
  ListPlus as ListPlusIcon,
  MoreVertical as MoreIcon,
  Play as PlayIcon,
  Share2 as ShareIcon,
} from "@tamagui/lucide-icons-2";
import { decodeHTML } from "entities";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Share } from "react-native";
import { toggleFavourite, useIsFavourited } from "src/db";
import type { FavouriteItem, Song } from "src/models";
import { createTrack } from "src/utils";
import {
  Avatar,
  Button,
  H4,
  ListItem,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

export function SongOptionsMenu(song: Song) {
  const [open, setOpen] = useState(false);
  const db = useSQLiteContext();
  const isFavourite = useIsFavourited(song.id);
  const favouriteItem: FavouriteItem = {
    id: song.id,
    title: song.title,
    subtitle: song.subtitle,
    image: song.image,
    type: song.type,
    perma_url: song.perma_url,
  };

  return (
    <>
      <Button chromeless icon={MoreIcon} circular size="$3" onPress={() => setOpen(true)} />
      {open && (
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[35]}
          dismissOnSnapToBottom
          zIndex={100_000}
          // @ts-expect-error Tamagui Sheet runtime supports animation prop
          animation="medium"
        >
          <Sheet.Overlay
            // @ts-expect-error Tamagui Sheet.Overlay runtime supports animation prop
            animation="lazy"
            bg="$shadow6"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Sheet.Handle bg="$color7" />
          <Sheet.Frame
            flex={1}
            borderTopLeftRadius="$5"
            borderTopRightRadius="$5"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            p="$3"
            gap="$2.5"
          >
            <XStack items="center" gap="$2.5" mb="$2" px="$1">
              <Avatar size="$4" rounded="$2">
                <Avatar.Image src={song.image} />
                <Avatar.Fallback bg="$color4" rounded="$2" />
              </Avatar>
              <YStack flex={1} overflow="hidden">
                <H4 fontSize="$3" fontWeight="700" numberOfLines={1}>
                  {decodeHTML(song.title)}
                </H4>
                <Paragraph size="$1" color="$color11" numberOfLines={1} mt="$0.5">
                  {decodeHTML(song.subtitle)}
                </Paragraph>
              </YStack>
            </XStack>

            <Separator borderColor="$borderColor" />

            <YGroup self="center" width="100%" size="$4" bg="transparent" gap="$0.5">
              <YGroup.Item>
                <ListItem
                  items="center"
                  icon={
                    <YStack width={28} height={28} items="center" justify="center">
                      <PlayIcon size={18} color="$blue10" />
                    </YStack>
                  }
                  title={
                    <SizableText size="$3" fontWeight="500" color="$color12">
                      Play song now
                    </SizableText>
                  }
                  size="$3"
                  py="$2"
                  px="$2"
                  rounded="$2"
                  hoverStyle={{ bg: "$color3" }}
                  pressStyle={{ bg: "$color4", scale: 0.99 }}
                  onPress={() => {
                    TrackPlayer.setMediaItems([createTrack(song)]);
                    TrackPlayer.play();
                    setOpen(false);
                  }}
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  items="center"
                  icon={
                    <YStack width={28} height={28} items="center" justify="center">
                      <ListPlusIcon size={18} color="$color11" />
                    </YStack>
                  }
                  title={
                    <SizableText size="$3" fontWeight="500" color="$color12">
                      Add to queue
                    </SizableText>
                  }
                  size="$3"
                  py="$2"
                  px="$2"
                  rounded="$2"
                  hoverStyle={{ bg: "$color3" }}
                  pressStyle={{ bg: "$color4", scale: 0.99 }}
                  onPress={() => {
                    TrackPlayer.addMediaItem(createTrack(song));
                    setOpen(false);
                  }}
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  items="center"
                  icon={
                    <YStack width={28} height={28} items="center" justify="center">
                      {isFavourite ? (
                        <HeartOffIcon size={18} color="$blue10" />
                      ) : (
                        <HeartPlusIcon size={18} color="$color11" />
                      )}
                    </YStack>
                  }
                  title={
                    <SizableText size="$3" fontWeight="500" color="$color12">
                      {isFavourite ? "Remove from favourites" : "Save to favourites"}
                    </SizableText>
                  }
                  size="$3"
                  py="$2"
                  px="$2"
                  rounded="$2"
                  hoverStyle={{ bg: "$color3" }}
                  pressStyle={{ bg: "$color4", scale: 0.99 }}
                  onPress={async () => {
                    setOpen(false);
                    await toggleFavourite(db, favouriteItem);
                  }}
                />
              </YGroup.Item>
              <YGroup.Item>
                <ListItem
                  items="center"
                  icon={
                    <YStack width={28} height={28} items="center" justify="center">
                      <ShareIcon size={18} color="$color11" />
                    </YStack>
                  }
                  title={
                    <SizableText size="$3" fontWeight="500" color="$color12">
                      Share song
                    </SizableText>
                  }
                  size="$3"
                  py="$2"
                  px="$2"
                  rounded="$2"
                  hoverStyle={{ bg: "$color3" }}
                  pressStyle={{ bg: "$color4", scale: 0.99 }}
                  onPress={() => {
                    Share.share({ message: song.perma_url });
                  }}
                />
              </YGroup.Item>
            </YGroup>
          </Sheet.Frame>
        </Sheet>
      )}
    </>
  );
}
