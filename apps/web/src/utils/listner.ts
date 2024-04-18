type Callback = (msg: MessageEvent<any>) => void;

export function listenOnce(callback: Callback) {
	const handler = (msg: MessageEvent<any>) => {
		const d = JSON.parse(msg.data);
		if (d.op === 'HEARTBEAT') return;

		callback(msg);
		window.ws?.removeEventListener('message', handler);
	};

	window.ws?.addEventListener('message', handler);
}

export function listen(callback: Callback) {
	window.ws?.addEventListener('message', callback);
}
