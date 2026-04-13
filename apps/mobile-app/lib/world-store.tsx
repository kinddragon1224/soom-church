import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getWorldSnapshot, type WorldSnapshot } from "./world-data-source";

type RuntimeTask = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

type WorldStoreValue = {
  loading: boolean;
  snapshot: WorldSnapshot | null;
  selectedId: string;
  setSelectedId: (id: string) => void;
  chatDraft: string;
  setChatDraft: (text: string) => void;
  runtimeTasks: RuntimeTask[];
  addRuntimeTask: (task: RuntimeTask) => void;
  refresh: () => Promise<void>;
};

const WorldStoreContext = createContext<WorldStoreValue | null>(null);

export function WorldStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<WorldSnapshot | null>(null);
  const [selectedId, setSelectedId] = useState("hub");
  const [chatDraft, setChatDraft] = useState("");
  const [runtimeTasks, setRuntimeTasks] = useState<RuntimeTask[]>([]);

  const refresh = async () => {
    setLoading(true);
    const next = await getWorldSnapshot();
    setSnapshot(next);
    setLoading(false);
  };

  const addRuntimeTask = (task: RuntimeTask) => {
    setRuntimeTasks((prev) => {
      const exists = prev.some((item) => item.title === task.title && item.due === task.due && item.owner === task.owner);
      if (exists) return prev;
      return [task, ...prev];
    });
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
      runtimeTasks,
      addRuntimeTask,
      refresh,
    }),
    [loading, snapshot, selectedId, chatDraft, runtimeTasks]
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
