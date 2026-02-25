import Dexie from "dexie";
const db = new Dexie("AutismApps");
db.version(1).stores({
  boards: "++id, name, category, createdAt",
  schedules: "++id, name, date, createdAt",
  settings: "++id, &key"
});
db.version(2).stores({
  boards: "++id, name, category, createdAt",
  schedules: "++id, name, date, createdAt",
  settings: "++id, &key",
  profiles: "++id, name, createdAt",
  appProgress: "++id, profileId, appId, [profileId+appId]"
});
