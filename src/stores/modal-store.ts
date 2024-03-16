import { create } from "zustand";

interface ModalState {
  key: Readonly<string>;
  onOpen: (key: string) => void;
  onOpenChange: (by: boolean) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  key: "",
  onOpen: (key: string) => set({ key }),
  onOpenChange: () => set({ key: "" }),
}));
