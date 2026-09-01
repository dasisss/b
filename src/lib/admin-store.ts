import { create } from "zustand";

type AdminStore = {
  open: boolean;
  setOpen: (v: boolean) => void;
  openPanel: () => void;
  closePanel: () => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false }),
}));
