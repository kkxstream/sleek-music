import {
  Check as CheckIcon,
  Headphones as HeadphonesIcon,
  Heart as HeartIcon,
  Languages as LanguagesIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  SunMoon as SunMoonIcon,
} from "@tamagui/lucide-icons-2";
import { LANGUAGES } from "src/models";
import { usePreferenceStore } from "src/utils";
import {
  Anchor,
  Card,
  H3,
  H4,
  Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  SizableText,
  ToggleGroup,
  XStack,
  YStack,
} from "tamagui";

const THEME_OPTIONS = [
  { value: "Auto", label: "Auto", icon: SunMoonIcon, desc: "System default" },
  { value: "Dark", label: "Dark", icon: MoonIcon, desc: "OLED dark mode" },
  { value: "Light", label: "Light", icon: SunIcon, desc: "Crisp light mode" },
];

const QUALITY_OPTIONS = [
  { value: "_320", label: "320 kbps", badge: "Extreme", desc: "Best audio fidelity" },
  { value: "_160", label: "160 kbps", badge: "High", desc: "Balanced performance" },
  { value: "_96", label: "96 kbps", badge: "Standard", desc: "Default streaming" },
  { value: "_48", label: "48 kbps", badge: "Low", desc: "Saves mobile data" },
  { value: "_12", label: "12 kbps", badge: "Saver", desc: "Minimum bandwidth" },
];

export default function SettingsPage() {
  const { theme, quality, languages, setTheme, setQuality, setLanguages } = usePreferenceStore();

  return (
    <ScrollView
      px="$3"
      py="$3"
      bg="$background"
      contentContainerStyle={{ pb: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <YStack gap="$4.5">
        <YStack gap="$2.5">
          <XStack items="center" gap="$2">
            <YStack p="$1.5" bg="$color3" rounded="$2">
              <LanguagesIcon size={18} color="$blue10" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize="$4" fontWeight="700">
                Music Languages
              </H3>
              <Paragraph color="$color11" size="$1">
                Select your preferred languages for tailored recommendations
              </Paragraph>
            </YStack>
          </XStack>

          <ToggleGroup
            type="multiple"
            value={languages}
            onValueChange={(val) => {
              if (val && val.length > 0) {
                setLanguages(val);
              }
            }}
            orientation="horizontal"
            unstyled
            flexDirection="row"
            flexWrap="wrap"
            gap="$2"
            pt="$0.5"
          >
            {Object.keys(LANGUAGES).map((lang) => {
              const isSelected = languages.includes(lang);
              return (
                <ToggleGroup.Item
                  key={lang}
                  value={lang}
                  unstyled
                  rounded="$10"
                  px="$3"
                  py="$1.5"
                  bg={isSelected ? "$blue10" : "$color3"}
                  borderColor={isSelected ? "$blue10" : "$borderColor"}
                  borderWidth={1}
                  pressStyle={{ scale: 0.96, opacity: 0.9 }}
                  hoverStyle={{ bg: isSelected ? "$blue11" : "$color4" }}
                >
                  <XStack items="center" gap="$1.5">
                    {isSelected && <CheckIcon size={13} color="white" />}
                    <SizableText
                      size="$1"
                      fontWeight={isSelected ? "700" : "500"}
                      color={isSelected ? "white" : "$color12"}
                    >
                      {lang}
                    </SizableText>
                  </XStack>
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup>
        </YStack>

        <Separator borderColor="$borderColor" />

        <YStack gap="$2.5">
          <XStack items="center" gap="$2">
            <YStack p="$1.5" bg="$color3" rounded="$2">
              <SunMoonIcon size={18} color="$blue10" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize="$4" fontWeight="700">
                Appearance
              </H3>
              <Paragraph color="$color11" size="$1">
                Choose light, dark, or follow device settings
              </Paragraph>
            </YStack>
          </XStack>

          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(val) => {
              if (val) {
                setTheme(val);
              }
            }}
            orientation="horizontal"
            unstyled
            flexDirection="row"
            gap="$2"
            pt="$0.5"
          >
            {THEME_OPTIONS.map((item) => {
              const isSelected = theme === item.value;
              return (
                <ToggleGroup.Item
                  key={item.value}
                  value={item.value}
                  unstyled
                  flex={1}
                  rounded="$3"
                  p="$2.5"
                  bg={isSelected ? "$color4" : "$color2"}
                  borderColor={isSelected ? "$blue10" : "$borderColor"}
                  borderWidth={1}
                  items="center"
                  gap="$1.5"
                  pressStyle={{ scale: 0.97, opacity: 0.9 }}
                  hoverStyle={{ bg: isSelected ? "$color5" : "$color3" }}
                >
                  <item.icon size={18} color={isSelected ? "$blue10" : "$color11"} />
                  <SizableText
                    size="$1"
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? "$color12" : "$color11"}
                  >
                    {item.label}
                  </SizableText>
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup>
        </YStack>

        <Separator borderColor="$borderColor" />

        <YStack gap="$2.5">
          <XStack items="center" gap="$2">
            <YStack p="$1.5" bg="$color3" rounded="$2">
              <HeadphonesIcon size={18} color="$blue10" />
            </YStack>
            <YStack flex={1}>
              <H3 fontSize="$4" fontWeight="700">
                Streaming Quality
              </H3>
              <Paragraph color="$color11" size="$1">
                Select audio streaming resolution and bitrate
              </Paragraph>
            </YStack>
          </XStack>

          <RadioGroup value={quality} onValueChange={setQuality} gap="$1.5" pt="$0.5">
            {QUALITY_OPTIONS.map((item) => {
              const isSelected = quality === item.value;
              return (
                <XStack
                  key={item.value}
                  items="center"
                  justify="space-between"
                  p="$2.5"
                  rounded="$3"
                  bg={isSelected ? "$color4" : "$color2"}
                  borderWidth={1}
                  borderColor={isSelected ? "$blue10" : "$borderColor"}
                  pressStyle={{ scale: 0.98, opacity: 0.9 }}
                  onPress={() => setQuality(item.value)}
                >
                  <XStack items="center" gap="$2.5" flex={1}>
                    <RadioGroup.Item
                      value={item.value}
                      id={`quality-${item.value}`}
                      size="$3"
                      bg="transparent"
                      borderColor={isSelected ? "$blue10" : "$color8"}
                      borderWidth={1.5}
                    >
                      <RadioGroup.Indicator bg="$blue10" />
                    </RadioGroup.Item>
                    <YStack flex={1}>
                      <SizableText size="$2" fontWeight={isSelected ? "700" : "600"}>
                        {item.label}
                      </SizableText>
                      <Paragraph size="$1" color="$color11">
                        {item.desc}
                      </Paragraph>
                    </YStack>
                  </XStack>

                  <YStack px="$2" py="$0.5" rounded="$10" bg={isSelected ? "$blue10" : "$color4"}>
                    <SizableText
                      size="$1"
                      fontWeight="700"
                      color={isSelected ? "white" : "$color11"}
                    >
                      {item.badge}
                    </SizableText>
                  </YStack>
                </XStack>
              );
            })}
          </RadioGroup>
        </YStack>

        <Separator borderColor="$borderColor" />

        <Card
          p="$3"
          rounded="$3"
          bg="$color2"
          borderWidth={1}
          borderColor="$borderColor"
          items="center"
          gap="$1.5"
        >
          <H4 fontSize="$3" fontWeight="700">
            Sleek Music
          </H4>
          <XStack items="center" gap="$1.5">
            <Paragraph size="$1" color="$color11">
              Crafted with
            </Paragraph>
            <HeartIcon size={13} color="$blue10" />
            <Paragraph size="$1" color="$color11">
              by
            </Paragraph>
            <Anchor
              color="$blue10"
              fontWeight="600"
              size="$1"
              href="https://github.com/LakhindarPal"
              target="_blank"
            >
              @Lakhindar
            </Anchor>
          </XStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}
