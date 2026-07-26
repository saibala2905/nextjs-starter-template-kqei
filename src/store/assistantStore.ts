import { create } from "zustand";

interface AssistantStore {
  // ==========================
  // Window State
  // ==========================

  isOpen: boolean;
  minimized: boolean;

  // ==========================
  // Position
  // ==========================

  x: number;
  y: number;

  width: number;
  height: number;

  // ==========================
  // Actions
  // ==========================

  open: () => void;
  close: () => void;

  minimize: () => void;
  restore: () => void;

  toggleMinimize: () => void;

  setPosition: (
    x: number,
    y: number
  ) => void;

  setSize: (
    width: number,
    height: number
  ) => void;
}

export const useAssistantStore =
  create<AssistantStore>((set) => ({

    // ==========================
    // Initial State
    // ==========================

    // Start with launcher visible
    isOpen: false,

    minimized: false,

    x: 1200,

    y: 120,

    width: 430,

    height: 650,

    // ==========================
    // Actions
    // ==========================

    open: () =>
      set({
        isOpen: true,
        minimized: false,
      }),

    close: () =>
      set({
        isOpen: false,
        minimized: false,
      }),

    minimize: () =>
      set({
        minimized: true,
      }),

    restore: () =>
      set({
        minimized: false,
      }),

    toggleMinimize: () =>
      set((state) => ({
        minimized: !state.minimized,
      })),

    setPosition: (x, y) =>
      set({
        x,
        y,
      }),

    setSize: (width, height) =>
      set({
        width,
        height,
      }),

  }));