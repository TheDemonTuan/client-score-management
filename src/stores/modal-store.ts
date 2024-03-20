import { create } from "zustand";

interface ModalState {
  modal_key: string;
  modalData: any;
  modalOpen: (key: string) => void;
  modalClose: () => void;
  changeModalData: (data: any) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  modal_key: "",
  modalData: {},
  modalOpen: (key: string) => set({ modal_key: key }),
  modalClose: () => set({ modal_key: "" }),
  changeModalData: (data) => set({ modalData: data }),
}));
