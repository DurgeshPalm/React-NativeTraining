import { create } from "zustand";

interface SignupState {
  name: string;
  email: string;
  password: string;
  mobileno: string;
  country_code_id: number | string;
  role: "C" | "P" | ""; // 👈 add this
  signupType: "email" | "mobile" | "";
  connectionid: string;
  setSignupData: (data: Partial<SignupState>) => void;
  resetSignupData: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  name: "",
  email: "",
  password: "",
  mobileno: "",
  country_code_id: "",
  role: "", 
  signupType: "",
  connectionid: "",
  setSignupData: (data) => set((state) => ({ ...state, ...data })),
  resetSignupData: () =>
    set({
      name: "",
      email: "",
      password: "",
      mobileno: "",
      country_code_id: "",
      role: "",
      signupType: "",
      connectionid: "",
    }),
}));
