import "../../tamagui.generated.css";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { migrateDbIfNeeded } from "src/db";
import { initPlayer } from "src/player";
import { PlayerSheet } from "src/ui";
import { usePreferenceStore } from "src/utils";
import { useTheme, TamaguiProvider, type TamaguiProviderProps } from "tamagui";

import { config } from "../../tamagui.config";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
    initPlayer();
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Providers>
        <RootLayoutNav />
      </Providers>
    </SafeAreaProvider>
  );
}

function Provider({ children, ...rest }: Omit<TamaguiProviderProps, "config" | "defaultTheme">) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { theme: themeSetting } = usePreferenceStore();
  const activeTheme =
    themeSetting === "Auto"
      ? colorScheme === "dark"
        ? "dark"
        : "light"
      : themeSetting.toLowerCase();

  return (
    <TamaguiProvider config={config} defaultTheme={activeTheme} insets={insets} {...rest}>
      {children}
      <PlayerSheet />
    </TamaguiProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SQLiteProvider
      databaseName="sleek-music.db"
      onInit={migrateDbIfNeeded}
      options={{ enableChangeListener: true }}
    >
      <Provider>{children}</Provider>
    </SQLiteProvider>
  );
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = usePreferenceStore();
  const activeTheme =
    themeSetting === "Auto"
      ? colorScheme === "dark"
        ? "dark"
        : "light"
      : themeSetting.toLowerCase();
  const theme = useTheme();

  return (
    <ThemeProvider value={activeTheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background.val,
          },
          headerTintColor: theme.color.val,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            presentation: "modal",
            animation: "slide_from_left",
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
