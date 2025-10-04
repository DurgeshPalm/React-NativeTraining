import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  loadTheme: () => void; 
}

const storage = new MMKV();

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (storage.getString("theme") as Theme) || "light",

  setTheme: (theme: Theme) => {
    set({ theme });
    try {
      storage.set("theme", theme);
    } catch (err) {
      console.warn("save theme error", err);
    }
  },

  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next); 
  },

  loadTheme: () => {
    try {
      const saved = storage.getString("theme");
      if (saved === "light" || saved === "dark") {
        set({ theme: saved });
      }
    } catch (err) {
      console.warn("load theme error", err);
    }
  },
}));
