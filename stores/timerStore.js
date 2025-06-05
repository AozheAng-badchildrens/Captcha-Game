// timerStore.js
import { create } from "zustand";

export const useTimerStore = create((set, get) => ({
  time: 0,
  running: false,
  startTimestamp: null,
  color: "white",

  start: () => {
    if (!get().running) {
      const now = Date.now();
      localStorage.setItem("startTimestamp", now.toString());
      set({ running: true, startTimestamp: now });
    }
  },

  stop: () => {
    if (get().running) {
      localStorage.removeItem("startTimestamp");
      set({ running: false });
    }
  },

  reset: () => {
    localStorage.removeItem("startTimestamp");
    set({ time: 0, running: false, startTimestamp: null, color: "black" });
  },

  tick: () => {
    if (get().running) {
      const now = Date.now();
      const start = get().startTimestamp;
      if (start) {
        set({ time: (now - start) / 1000 });
      }
    }
  },

  flashColor: (color, duration = 2000) => {
    set({ color });
    setTimeout(() => set({ color: "white" }), duration);
  },

  init: () => {
    const saved = localStorage.getItem("startTimestamp");
    if (saved) {
      const start = parseInt(saved, 10);
      set({ running: true, startTimestamp: start });
    }
  },
}));
