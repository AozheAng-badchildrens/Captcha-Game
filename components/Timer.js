import React, { useEffect } from "react";
import { useTimerStore } from "../stores/timerStore";

export default function Timer() {
  const { time, running, tick, color, init } = useTimerStore();

  useEffect(() => {
    let interval;
    init();
    if (running) {
      interval = setInterval(() => {
        tick();
      }, 100);
    }
    return () => clearInterval(interval);
  }, [running, tick]);

  const formatTime = (t) => {
    const totalSeconds = Math.floor(t);
    const decimal = Math.floor((t % 1) * 10);
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}.${decimal}`;
  };

  return <h1 style={{ color }}>{formatTime(time)}</h1>;
}
