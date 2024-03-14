import { create } from "zustand";

interface PathNameState {
  current: string;
  change: (by: string) => void;
}

export const usePathNameStore = create<PathNameState>()((set) => ({
  current: "/",
  change: (by) => set((state) => ({ current: by })),
}));
