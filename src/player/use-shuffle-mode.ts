import TrackPlayer from "@rntp/player";
import { useCallback, useEffect, useState } from "react";

export const useShuffleMode = () => {
  const [shuffleStatus, setShuffleStatus] = useState<boolean>(() => TrackPlayer.isShuffleEnabled());

  const toggleShuffleMode = useCallback(() => {
    const next = !shuffleStatus;
    TrackPlayer.setShuffleEnabled(next);
    setShuffleStatus(next);
  }, [shuffleStatus]);

  useEffect(() => {
    setShuffleStatus(TrackPlayer.isShuffleEnabled());
  }, []);

  return {
    shuffleMode: shuffleStatus,
    toggleShuffleMode,
  };
};
