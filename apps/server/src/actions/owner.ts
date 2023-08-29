import connections from '../utils/connections.js';
import type WebSocket from 'ws';
import prisma from '../utils/prisma.js';

export default async function owner(ws: WebSocket, msg: string) {
	const { op, auth, data } = JSON.parse(msg);

	const owner = Array.from(connections.values()).find((c) => c.auth === auth && c.type === 'OWNER');
	if (!owner) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vid = data?.associated_vehicle ?? null;
	const vehicle = Array.from(connections.values()).find((c) => c.id === vid && c.type === 'VEHICLE');

	if (op === 'SET_BYPASS_PWD') {
		if (!vehicle) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		vehicle.ws.once('message', async (msg) => {
			const data = JSON.parse(msg.toString());
			ws.send(JSON.stringify({ op: data.op }));
		});

		vehicle.ws.send(
			JSON.stringify({
				op: op,
				password: data.password
			})
		);
	} else if (op === 'GET_LASTEST_ACTION_LOGS') {
		const limit = data.limit;
		const logs = await prisma.logs.findMany({ take: limit, orderBy: { timestamp: 'desc' } });
		ws.send(JSON.stringify({ op: 'LASTEST_ACTION_LOGS', data: logs }));
	} else if (op === 'ADD_STOP') {
		if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		const { lat, lng } = data.location;
		await prisma.vehicle_locations.create({ data: { latitude: lat, longitude: lng, v_id: vid } });
		ws.send(JSON.stringify({ op: op + '_SUCCESS' }));
	} else if (op === 'GET_ALL_STOPS') {
		if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		const stops = await prisma.vehicle_locations.findMany({ where: { v_id: vid } });
		ws.send(JSON.stringify({ op: 'ALL_STOPS', data: stops }));
	} else if (op === 'GET_ALL_VEHICLES') {
		const vehicles = await prisma.authorized_drivers.findMany();
		ws.send(JSON.stringify({ op: 'ALL_VEHICLES', data: vehicles.map((v) => v.v_id) }));
	}
}
