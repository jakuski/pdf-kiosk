"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        height: 500,
        width: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../src/loader.html'));
    // Open <a/> tags in browser
    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        electron_1.shell.openExternal(url);
    });
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.ipcMain.on("OPEN_KIOSK", function (ev, data) {
    var kioskWindow = new electron_1.BrowserWindow({
        kiosk: false,
        webPreferences: {
            preload: path.join(__dirname, "kiosk.js")
        }
    });
    kioskWindow.loadFile(data.path);
});
//# sourceMappingURL=main.js.map