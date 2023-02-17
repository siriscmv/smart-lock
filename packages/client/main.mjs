import WebSocket from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();

let interval = null;

const ws = new WebSocket(process.env.WEBSOCKET_URL, {
	perMessageDeflate: false
});

ws.on('open', () => {
	console.log('Connected to WS');
	ws.send(JSON.stringify({ op: 1, d: { id: process.env.CLIENT_ID } }));
});

ws.on('message', (data) => {
	const data = JSON.parse(data);

	switch (data.op) {
		case 0:
			break;
		case 1: {
			interval = setInterval(() => {
				ws.send(JSON.stringify({ op: 2, d: { id: process.env.CLIENT_ID } })); //TODO: Send location data here
			}, data.d.interval);
		}
	}
});
