import type { ReactNode } from "react";
import { ScrollView } from "tamagui";

export function GridView({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator
      flex={1}
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        justify: "center",
        gap: "$3",
        pb: "$16",
        pt: "$1.5",
      }}
    >
      {children}
    </ScrollView>
  );
}
