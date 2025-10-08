import * as TaskManager from 'expo-task-manager';


export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location error:", error);
    return;
  }

  if (data) {
    const { locations } = data as any;
    const location = locations[0];
    if (location) {
      console.log("📍 Background location:", location.coords);
    }
  }
});
