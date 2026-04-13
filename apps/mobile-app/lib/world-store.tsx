import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getWorldSnapshot, type WorldSnapshot } from "./world-data-source";

const RUNTIME_TASKS_KEY = "soom.mobile.runtime.tasks";

type RuntimeTask = {
  id: string;
  title: string;
  due: string;
  owner: string;
  completed: boolean;
  createdAt: number;
};

type NewRuntimeTask = {
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
  addRuntimeTask: (task: NewRuntimeTask) => void;
  toggleRuntimeTask: (taskId: string) => void;
  refresh: () => Promise<void>;
};

const WorldStoreContext = createContext<WorldStoreValue | null>(null);

function normalizeRuntimeTasks(value: unknown): RuntimeTask[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const maybe = item as Partial<RuntimeTask>;
      if (!maybe.id || !maybe.title || !maybe.due || !maybe.owner) return null;

      return {
        id: String(maybe.id),
        title: String(maybe.title),
        due: String(maybe.due),
        owner: String(maybe.owner),
        completed: Boolean(maybe.completed),
        createdAt: typeof maybe.createdAt === "number" ? maybe.createdAt : Date.now(),
      };
    })
    .filter((item): item is RuntimeTask => Boolean(item));
}

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

  const addRuntimeTask = (task: NewRuntimeTask) => {
    setRuntimeTasks((prev) => {
      const exists = prev.some((item) => item.title === task.title && item.due === task.due && item.owner === task.owner);
      if (exists) return prev;

      return [
        {
          ...task,
          completed: false,
          createdAt: Date.now(),
        },
        ...prev,
      ];
    });
  };

  const toggleRuntimeTask = (taskId: string) => {
    setRuntimeTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const loadRuntimeTasks = async () => {
      try {
        const raw = await AsyncStorage.getItem(RUNTIME_TASKS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as unknown;
        setRuntimeTasks(normalizeRuntimeTasks(parsed));
      } catch {
        setRuntimeTasks([]);
      }
    };

    loadRuntimeTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(RUNTIME_TASKS_KEY, JSON.stringify(runtimeTasks)).catch(() => {
      // ignore persistence failure
    });
  }, [runtimeTasks]);

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
      toggleRuntimeTask,
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
