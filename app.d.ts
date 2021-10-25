declare namespace KioskTypes {
	export interface OpenObject {
		path: string;
		password: string;
	}
}


interface KioskAppApi {
	show: (openObject: KioskTypes.OpenObject) => void;
}

declare const kiosk_app: KioskAppApi;