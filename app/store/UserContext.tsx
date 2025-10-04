import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { safeStorage } from "./storage";

type User = {
  name: string | null;
  email: string | null;
  prpfilePictureUrl?: string | null;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userName = safeStorage.getString("name") ?? null;
      const userEmail = safeStorage.getString("email") ?? null;
      if (userName) {
        setUser({ name: userName, email: userEmail });
      }
    };
    loadUser();
  }, []);

  const logout = () => {
    setUser(null);
    safeStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return context;
};
