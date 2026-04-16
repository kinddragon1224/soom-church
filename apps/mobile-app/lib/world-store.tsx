import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";
import { fetchLatestChatBackupActions } from "./chat-source";
import { fetchRuntimeTasks, syncRuntimeTasks, type RuntimeTask } from "./runtime-task-source";
import { registerWorldAttendanceToday, type WorldAttendanceRewardState } from "./world-attendance-reward";
import { getWorldSnapshot, type WorldSnapshot } from "./world-data-source";

const RUNTIME_TASKS_KEY = "soom.mobile.runtime.tasks";

async function runtimeTasksScopedKeys() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return {
    current: `${RUNTIME_TASKS_KEY}:${churchSlug}:${accountKey}`,
    legacy: RUNTIME_TASKS_KEY,
  };
}

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
  attendanceReward: WorldAttendanceRewardState | null;
  addRuntimeTask: (task: NewRuntimeTask) => void;
  toggleRuntimeTask: (taskId: string) => void;
  refreshAttendance: () => Promise<void>;
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
  const [attendanceReward, setAttendanceReward] = useState<WorldAttendanceRewardState | null>(null);
  const [runtimeHydrated, setRuntimeHydrated] = useState(false);

  const refresh = async () => {
    setLoading(true);

    try {
      const next = await getWorldSnapshot();
      setSnapshot(next);
    } catch {
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
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

  const refreshAttendance = async () => {
    try {
      const next = await registerWorldAttendanceToday();
      setAttendanceReward(next);
    } catch {
      setAttendanceReward(null);
    }
  };

  useEffect(() => {
    refresh();
    refreshAttendance();
  }, []);

  useEffect(() => {
    const bootstrapRuntimeTasks = async () => {
      let localTasks: RuntimeTask[] = [];

      try {
        const keys = await runtimeTasksScopedKeys();
        const raw = await AsyncStorage.getItem(keys.current);
        const legacyRaw = raw ? null : await AsyncStorage.getItem(keys.legacy);
        const source = raw ?? legacyRaw;

        localTasks = normalizeRuntimeTasks(source ? JSON.parse(source) : []);

        if (!raw && legacyRaw && localTasks.length) {
          await AsyncStorage.setItem(keys.current, JSON.stringify(localTasks));
        }
      } catch {
        localTasks = [];
      }

      const remoteTasks = await fetchRuntimeTasks();
      let nextTasks = remoteTasks.length ? remoteTasks : localTasks;

      if (!nextTasks.length) {
        const backupActions = await fetchLatestChatBackupActions(24);
        if (backupActions.length) {
          nextTasks = backupActions.map((action, index) => ({
            id: `backup-${action.id}-${index}`,
            title: action.title,
            due: action.due,
            owner: action.owner,
            completed: false,
            createdAt: Date.now() - index,
          }));
        }
      }

      setRuntimeTasks(nextTasks);
      setRuntimeHydrated(true);
    };

    bootstrapRuntimeTasks();
  }, []);

  useEffect(() => {
    if (!runtimeHydrated) return;

    runtimeTasksScopedKeys()
      .then((keys) => AsyncStorage.setItem(keys.current, JSON.stringify(runtimeTasks)))
      .catch(() => {
        // ignore persistence failure
      });

    const timer = setTimeout(() => {
      syncRuntimeTasks(runtimeTasks);
    }, 350);

    return () => clearTimeout(timer);
  }, [runtimeTasks, runtimeHydrated]);

  const value = useMemo<WorldStoreValue>(
    () => ({
      loading,
      snapshot,
      selectedId,
      setSelectedId,
      chatDraft,
      setChatDraft,
      runtimeTasks,
      attendanceReward,
      addRuntimeTask,
      toggleRuntimeTask,
      refreshAttendance,
      refresh,
    }),
    [loading, snapshot, selectedId, chatDraft, runtimeTasks, attendanceReward]
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
