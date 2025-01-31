// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  onSelectedText: (callback: (text: string) => void) => {
    ipcRenderer.on("selected-text", (_event, text) => callback(text));
  },
  openUrl: (url: string) => {
    return ipcRenderer.invoke("open-external-url", url);
  },
});
