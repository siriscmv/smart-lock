import connections from '../utils/connections.js';
import type WebSocket from 'ws';

export default async function driver(ws: WebSocket, msg: string) {
	const {
		op,
		auth,
		data: { password, associated_vehicle }
	} = JSON.parse(msg);
	if (op !== 'SET_BYPASS_PWD') return;

	const owner = Array.from(connections.values()).find((c) => c.auth === auth && c.type === 'OWNER');
	if (!owner) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vid = associated_vehicle ?? null;
	if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vehicle = Array.from(connections.values()).find((c) => c.id === vid && c.type === 'VEHICLE');
	if (!vehicle) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	vehicle.ws.once('message', async (msg) => {
		const data = JSON.parse(msg.toString());
		ws.send(JSON.stringify({ op: data.op }));
	});

	vehicle.ws.send(
		JSON.stringify({
			op: op,
            password
		})
	);
}
