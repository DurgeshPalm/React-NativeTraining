import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  setTheme: (theme: Theme) => {
    set({ theme });
    AsyncStorage.setItem('theme', theme).catch(err => console.warn('save theme error', err));
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: next });
    AsyncStorage.setItem('theme', next).catch(err => console.warn('save theme error', err));
  },

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') set({ theme: saved });
    } catch (err) {
      console.warn('load theme error', err);
    }
  },
}));
