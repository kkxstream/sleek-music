import TrackPlayer, { RepeatMode } from "@rntp/player";
import { useCallback, useEffect, useState } from "react";

export const useRepeatMode = () => {
  const [repeatStatus, setRepeatStatus] = useState<RepeatMode>(() => TrackPlayer.getRepeatMode());

  const cycleRepeatMode = useCallback(() => {
    const nextMode =
      repeatStatus === RepeatMode.Off
        ? RepeatMode.One
        : repeatStatus === RepeatMode.One
          ? RepeatMode.All
          : RepeatMode.Off;
    TrackPlayer.setRepeatMode(nextMode);
    setRepeatStatus(nextMode);
  }, [repeatStatus]);

  useEffect(() => {
    setRepeatStatus(TrackPlayer.getRepeatMode());
  }, []);

  return { repeatMode: repeatStatus, cycleRepeatMode };
};
