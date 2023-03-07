import { WebSocketServer, type WebSocket } from 'ws';

let running = false;
export const isRunning = () => running;

export const connections = new Map<number, WebSocket>();

console.log('Starting WebSocket server...');
const ws = new WebSocketServer({ port: parseInt(process.env.WEBSOCKET_PORT!) }, () => (running = true));

ws.on('connection', async (socket) => {
	const id = await getId(socket);
	if (id) {
		connections.set(id, socket);
		console.log(`Client ${id} connected`);
	} else console.error('Client did not identify itself');
});

const getId = (socket: WebSocket): Promise<number | null> => {
	return new Promise((resolve) => {
		socket.once('message', (raw) => {
			try {
				const data = JSON.parse(raw.toString());
				if (data.op === 0 && data.d?.id) resolve(parseInt(data.d.id));
				else resolve(null);
			} catch (_) {
				resolve(null);
			}
		});
	});
};
