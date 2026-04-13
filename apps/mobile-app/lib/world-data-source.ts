import { chatQuickActions, peopleRecords, taskRecords, worldObjects } from "./world-model";

export type WorldSnapshot = {
  worldObjects: typeof worldObjects;
  peopleRecords: typeof peopleRecords;
  taskRecords: typeof taskRecords;
  chatQuickActions: typeof chatQuickActions;
};

export async function getWorldSnapshot(): Promise<WorldSnapshot> {
  // TODO: Replace with real mobile API call.
  return {
    worldObjects,
    peopleRecords,
    taskRecords,
    chatQuickActions,
  };
}
