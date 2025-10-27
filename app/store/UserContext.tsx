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


// import { create } from "zustand";
// import { MMKV } from "react-native-mmkv";

// const storage = new MMKV();

// type User = {
//   name: string | null;
//   email: string | null;
//   profilePictureUrl?: string | null;
// } | null;

// interface UserState {
//   user: User;
//   setUser: (user: User) => void;
//   loadUser: () => void;
//   logout: () => void;
// }

// export const useUserStore = create<UserState>((set) => ({
//   user: null,

//   setUser: (user) => {
//     set({ user });
//     if (user) {
//       storage.set("name", user.name || "");
//       storage.set("email", user.email || "");
//       if (user.profilePictureUrl) {
//         storage.set("profilePictureUrl", user.profilePictureUrl);
//       }
//     }
//   },

//   loadUser: () => {
//     const name = storage.getString("name") ?? null;
//     const email = storage.getString("email") ?? null;
//     const profilePictureUrl = storage.getString("profilePictureUrl") ?? null;

//     if (name || email) {
//       set({ user: { name, email, profilePictureUrl } });
//     }
//   },

//   logout: () => {
//     set({ user: null });
//     storage.clear();
//   },
// }));
