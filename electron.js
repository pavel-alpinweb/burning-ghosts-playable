import { app, BrowserWindow } from 'electron';
import { LEVEL_WIDTH, LEVEL_HEIGHT } from './src/configs/engine.config.js';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: LEVEL_WIDTH,
    height: LEVEL_HEIGHT,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenu(null);
  win.loadFile(path.join(appDir, 'dist', 'index.html'));
  if(!app.isPackaged) win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});