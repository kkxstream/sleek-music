import { BottomTabBar } from "@react-navigation/bottom-tabs";
import {
  BookHeart as BookHeartIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
} from "@tamagui/lucide-icons-2";
import { Link, RelativePathString, Tabs } from "expo-router";
import { FloatingPlayer } from "src/ui";
import { Button, ColorTokens, useTheme, YStack } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => (
        <YStack bg="$background">
          <FloatingPlayer />
          <BottomTabBar {...props} />
        </YStack>
      )}
      screenOptions={{
        tabBarActiveTintColor: theme.blue10.val,
        tabBarInactiveTintColor: theme.color11.val,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
          borderTopWidth: 1,
          elevation: 4,
          height: 52,
          paddingBottom: 4,
          paddingTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color as ColorTokens} />,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          headerLeft: () => (
            <Link href={"/settings" as RelativePathString} asChild>
              <Button chromeless circular size="$3" icon={MenuIcon} ml="$2" />
            </Link>
          ),
          tabBarIcon: ({ color }) => <BookHeartIcon color={color as ColorTokens} />,
        }}
      />
    </Tabs>
  );
}
