import { peopleRecords, taskRecords, worldObjects } from "./world-model";

export function getWorldSummary() {
  return {
    objectCount: worldObjects.length,
    householdCount: worldObjects.filter((item) => item.kind === "house").length,
    peopleCount: peopleRecords.length,
    taskCount: taskRecords.length,
  };
}
