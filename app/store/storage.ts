
import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;
const memoryStorage: Record<string, string> = {};

try {
  storage = new MMKV();
} catch (e) {
  console.warn("MMKV not available (maybe remote debugger?). Using memory fallback.",e);
}

export const safeStorage = {
  set: (key: string, value: string) => {
    if (storage) storage.set(key, value);
    else memoryStorage[key] = value;
  },
  getString: (key: string) => {
    if (storage) return storage.getString(key);
    else return memoryStorage[key] || null;
  },
  remove: (key: string) => {
    if (storage) storage.delete(key);
    else delete memoryStorage[key];
  },
    clear: () => {
    if (storage) storage.clearAll();
    else Object.keys(memoryStorage).forEach(k => delete memoryStorage[k]);
  },
};
