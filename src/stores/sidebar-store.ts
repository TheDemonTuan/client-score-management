import { create } from "zustand";

interface SideBarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSideBarStore = create<SideBarState>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
