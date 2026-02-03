import { app, BrowserWindow, ipcMain } from "electron";
import { syncTime, now } from "./ntp.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

let win;

async function createWindow() {
  await syncTime();

  win = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("index.html");
}

ipcMain.handle("now", () => now());

setInterval(syncTime, 300000);

app.whenReady().then(createWindow);
