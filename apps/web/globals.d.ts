declare global {
	interface Window {
		ws: WebSocket | null;
		auth: string | null;
	}
}

export {};
