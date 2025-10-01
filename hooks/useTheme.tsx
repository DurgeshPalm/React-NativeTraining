import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "light" || saved === "dark") setTheme(saved);
      } catch (e) {
        console.warn("load theme error", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const next = theme === "light" ? "dark" : "light";
      setTheme(next);
      console.log("set theme", next);

      await AsyncStorage.setItem("theme", next);
    } catch (e) {
      console.warn("save theme error", e);
    }
  };

  return { theme, toggleTheme };
};

export default useTheme;
