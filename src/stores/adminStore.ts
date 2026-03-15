import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_KEY_STORAGE = "admin_key";

function syncKeyToStorage(key: string | null) {
  if (key) localStorage.setItem(ADMIN_KEY_STORAGE, key);
  else localStorage.removeItem(ADMIN_KEY_STORAGE);
}

type AdminState = {
  adminKey: string | null;
  setAdminKey: (key: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminKey: null,
      setAdminKey: (key) => {
        syncKeyToStorage(key);
        set({ adminKey: key });
      },
      logout: () => {
        syncKeyToStorage(null);
        set({ adminKey: null });
      },
      hydrate: () => {
        const key = useAdminStore.getState().adminKey;
        if (key) syncKeyToStorage(key);
      },
    }),
    {
      name: "admin-storage",
      partialize: (s) => ({ adminKey: s.adminKey }),
    }
  )
);
