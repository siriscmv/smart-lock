import WebSocket, { WebSocketServer } from 'ws';
import prisma from './prisma.js';
import { randomBytes } from 'node:crypto';
import driver from '../actions/driver.js';
import owner from '../actions/owner.js';

interface Socket {
	id: number;
	ws: WebSocket;
	type: 'VEHICLE' | 'OWNER' | 'DRIVER';
	auth?: string;
	associated_vehicle?: number;
}

const connections = new Map<number, Socket>();
export default connections;

export const wss = new WebSocketServer({ port: parseInt(process.env.WEBSOCKET_PORT!) });

wss.on('connection', async (ws: WebSocket) => {
	const socket = await identify(ws);

	if (socket) {
		connections.set(socket.id, socket);
		console.log(`Client ${socket.id} connected`);
	} else console.error('Client did not identify itself');
});

const identify = (ws: WebSocket): Promise<Socket | null> => {
	return new Promise((resolve) => {
		ws.once('message', async (raw) => {
			try {
				const data = JSON.parse(raw.toString());
				if (data.op !== 'IDENTIFY') return resolve(null);

				const { id, type, username, password, associated_vehicle } = data.data;
				if (type === 'VEHICLE') {
					resolve({
						id,
						ws,
						type
					});
				} else if (type === 'DRIVER') {
					const id = (await prisma.drivers.findFirst({ where: { username, password } }))?.id;
					if (!id || !associated_vehicle) {
						ws.send(
							JSON.stringify({
								op: 'IDENTIFY_FAIL'
							})
						);
						ws.close();
						resolve(null);
					} else {
						const auth = randomBytes(128).toString('hex');
						ws.send(
							JSON.stringify({
								OP: 'IDENTIFY_OK',
								auth
							})
						);
						ws.on('message', driver.bind(null, ws));
						resolve({
							id,
							ws,
							type,
							auth,
							associated_vehicle
						});
					}
				} else if (type === 'OWNER') {
					const id = (await prisma.owners.findFirst({ where: { username, password } }))?.id;
					if (!id) {
						ws.send(
							JSON.stringify({
								op: 'IDENTIFY_FAIL'
							})
						);
						ws.close();
						resolve(null);
					} else {
						const auth = randomBytes(128).toString('hex');
						ws.send(
							JSON.stringify({
								OP: 'IDENTIFY_OK',
								auth
							})
						);
						ws.on('message', owner.bind(null, ws));
						resolve({
							id,
							ws,
							type,
							auth
						});
					}
				} else resolve(null);
			} catch (_) {
				resolve(null);
			}
		});
	});
};

setInterval(() => {
	connections.forEach((c) => {
		c.ws.send(JSON.stringify({ op: 'HEARTBEAT' }));
	});
}, 30_000);
