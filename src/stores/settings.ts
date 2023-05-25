import { create } from "zustand";
import { persist } from "zustand/middleware";

type Settings = {
  language: "en" | "tr";
  setLanguage: (language: "en" | "tr") => void;
};

export const useSettings = create(
  persist<Settings>(
    (set) => ({
      language: "tr",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "settings",
    }
  )
);
