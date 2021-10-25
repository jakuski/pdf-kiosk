import { contextBridge, ipcRenderer } from 'electron';

const api: KioskAppApi = {
	show (openObject) {
		ipcRenderer.send("OPEN_KIOSK", openObject);
	}
}

contextBridge.exposeInMainWorld("kiosk_app", api);