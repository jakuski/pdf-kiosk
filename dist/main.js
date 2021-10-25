"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
var kioskWindow;
var mainWindow;
var focusInterval;
var onQuit = function () {
    if (!kioskWindow)
        return electron_1.app.quit();
    kioskWindow.webContents.send("PASSWORD_REQUEST");
};
var blankMenu = new electron_1.Menu();
electron_1.app.applicationMenu = blankMenu;
var createWindow = function () {
    ["CmdOrCtrl+P", "CmdOrCtrl+Q", "Alt+Tab"].forEach(function (shortcut) {
        electron_1.globalShortcut.register(shortcut, onQuit);
    });
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        height: 550,
        width: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });
    mainWindow.setMenu(blankMenu);
    mainWindow.setMenuBarVisibility(false);
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
    kioskWindow = new electron_1.BrowserWindow({
        kiosk: true,
        fullscreen: true,
        closable: false,
        webPreferences: {
            preload: path.join(__dirname, "kiosk.js")
        }
    });
    kioskWindow.setMenu(blankMenu);
    kioskWindow.setMenuBarVisibility(false);
    kioskWindow.loadFile(data.path);
    kioskWindow.webContents.on("will-navigate", function (e, url) {
        e.preventDefault();
        console.log(url);
        kioskWindow.webContents.send("EXTERNAL_URL_NOT_PERMITTED");
    });
    // https://github.com/electron/electron/issues/18207
    kioskWindow.on("blur", function () {
        kioskWindow.focus();
    });
    // Disables Alt+F4
    kioskWindow.on("close", function (ev) {
        ev.preventDefault();
    });
    // This is so f*kin dirty. This is basically malware.
    focusInterval = setInterval(function (win) {
        var focused = win.isFocused();
        console.log(focused);
        if (focused)
            return;
        win.restore();
        win.moveTop();
        win.focus();
    }, 500, kioskWindow);
});
electron_1.ipcMain.on("CLOSE_KIOSK", function () {
    if (kioskWindow) {
        kioskWindow.destroy();
    }
    if (focusInterval) {
        {
            clearInterval(focusInterval);
        }
    }
});
//# sourceMappingURL=main.js.map