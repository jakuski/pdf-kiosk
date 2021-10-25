"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var api = {
    show: function (openObject) {
        electron_1.ipcRenderer.send("OPEN_KIOSK", openObject);
    }
};
electron_1.contextBridge.exposeInMainWorld("kiosk_app", api);
//# sourceMappingURL=preload.js.map