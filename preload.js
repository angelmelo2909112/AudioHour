import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("clock", {
  now: () => ipcRenderer.invoke("now")
});
