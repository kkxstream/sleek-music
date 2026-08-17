import { useSyncExternalStore } from "react";

let isPlayerSheetOpen = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return isPlayerSheetOpen;
}

export const playerSheetStore = {
  setOpen: (open: boolean) => {
    isPlayerSheetOpen = open;
    listeners.forEach((l) => l());
  },
  toggle: () => {
    isPlayerSheetOpen = !isPlayerSheetOpen;
    listeners.forEach((l) => l());
  },
};

export function usePlayerSheetStore() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot);
  return { isOpen, ...playerSheetStore };
}
