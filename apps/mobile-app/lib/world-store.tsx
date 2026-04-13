import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getWorldSnapshot, type WorldSnapshot } from "./world-data-source";

type WorldStoreValue = {
  loading: boolean;
  snapshot: WorldSnapshot | null;
  selectedId: string;
  setSelectedId: (id: string) => void;
  chatDraft: string;
  setChatDraft: (text: string) => void;
  refresh: () => Promise<void>;
};

const WorldStoreContext = createContext<WorldStoreValue | null>(null);

export function WorldStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<WorldSnapshot | null>(null);
  const [selectedId, setSelectedId] = useState("hub");
  const [chatDraft, setChatDraft] = useState("");

  const refresh = async () => {
    setLoading(true);
    const next = await getWorldSnapshot();
    setSnapshot(next);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo<WorldStoreValue>(
    () => ({
      loading,
      snapshot,
      selectedId,
      setSelectedId,
      chatDraft,
      setChatDraft,
      refresh,
    }),
    [loading, snapshot, selectedId, chatDraft]
  );

  return <WorldStoreContext.Provider value={value}>{children}</WorldStoreContext.Provider>;
}

export function useWorldStore() {
  const context = useContext(WorldStoreContext);

  if (!context) {
    throw new Error("useWorldStore must be used within WorldStoreProvider");
  }

  return context;
}
