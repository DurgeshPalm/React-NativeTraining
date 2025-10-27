import { create } from "zustand";

interface Friend {
  id: number;
  name: string;
}

interface FriendsState {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (id: number) => void;
  reset : () => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  addFriend: (name) =>
    set((state) => ({
      friends: [
        ...state.friends,
        { id: Date.now(), name }, 
      ],
    })),
  removeFriend: (id) =>
    set((state) => ({
      friends: state.friends.filter((friend) => friend.id !== id),
    })),
    reset:()=>set((state=>({friends:[]})))
}));
