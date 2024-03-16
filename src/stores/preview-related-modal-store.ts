import { create } from "zustand";

export interface PreviewRelatedColumns {
  name: string;
  uid: string;
}

interface PreviewRelatedModalState {
  previewRelatedData: any[];
  setPreviewRelatedData: <T>(by: T[]) => void;
  previewRelatedColumns: PreviewRelatedColumns[];
  setPreviewRelatedColumns: (by: PreviewRelatedColumns[]) => void;
  isPreviewRelatedOpen: boolean;
  setIsPreviewRelatedOpen: (by: boolean) => void;
  handleOpenPreviewRelatedModal: <T>(data: T[], columns: PreviewRelatedColumns[]) => void;
}

export const usePreviewRelatedStore = create<PreviewRelatedModalState>()((set) => ({
  previewRelatedData: [],
  setPreviewRelatedData: (by) => set({ previewRelatedData: by }),
  previewRelatedColumns: [],
  setPreviewRelatedColumns: (by: PreviewRelatedColumns[]) => set({ previewRelatedColumns: by }),
  isPreviewRelatedOpen: false,
  setIsPreviewRelatedOpen: (by) => set({ isPreviewRelatedOpen: by }),
  handleOpenPreviewRelatedModal: (data, columns) =>
    set({
      previewRelatedData: data,
      previewRelatedColumns: columns,
      isPreviewRelatedOpen: true,
    }),
}));
