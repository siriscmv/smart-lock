import connections from '../utils/connections.js';
import type WebSocket from 'ws';
import prisma from '../utils/prisma.js';

export default async function owner(ws: WebSocket, msg: string) {
	const { op, auth, data } = JSON.parse(msg);

	const owner = Array.from(connections.values()).find((c) => c.auth === auth && c.type === 'OWNER');
	if (!owner) return ws.send(JSON.stringify({ op: op + '_FAIL' }));
	const vid = data?.associated_vehicle ?? null;
	const vehicle = Array.from(connections.values()).find((c) => c.id === vid && c.type === 'VEHICLE');

	if (op === 'GET_LASTEST_ACTION_LOGS') {
		const limit = data.limit;
		const logs = await prisma.logs.findMany({ take: limit, orderBy: { timestamp: 'desc' } });
		ws.send(JSON.stringify({ op: 'LASTEST_ACTION_LOGS', data: logs }));
	} else if (op === 'UPSERT_STOP') {
		const { lat, lng, name, id } = data.location;
		if (!vid && !id) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		let record = null;
		if (id) record = await prisma.vehicle_locations.update({ data: { latitude: lat, longitude: lng }, where: { id } });
		else
			record = await prisma.vehicle_locations.create({
				data: { latitude: lat, longitude: lng, name: name ?? '', v_id: vid }
			});

		ws.send(JSON.stringify({ op: op + '_SUCCESS', data: { lat, lng, id: record.id } }));
	} else if (op === 'REMOVE_STOP') {
		const { id } = data.location;

		await prisma.vehicle_locations.delete({ where: { id } });
		ws.send(JSON.stringify({ op: op + '_SUCCESS' }));
	} else if (op === 'GET_ALL_STOPS') {
		if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		const stops = await prisma.vehicle_locations.findMany({ where: { v_id: vid } });
		ws.send(JSON.stringify({ op: 'ALL_STOPS', data: stops }));
	} else if (op === 'GET_ALL_VEHICLES') {
		const vehicles = await prisma.authorized_drivers.findMany();
		ws.send(JSON.stringify({ op: 'ALL_VEHICLES', data: vehicles.map((v) => v.v_id) }));
	} else if (op === 'ADD_OTP') {
		if (!vehicle) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		vehicle.ws.once('message', (msg) => ws.send(msg.toString()));
		vehicle.ws.send(
			JSON.stringify({
				op: op,
				password: data.password
			})
		);
	} else if (op === 'GET_DRIVERS') {
		const drivers = await prisma.authorized_drivers.findMany();
		ws.send(JSON.stringify({ op: op + '_SUCCESS', data: drivers.map((d) => ({ driver: d.d_id, vehicle: d.v_id })) }));
	} else if (op === 'ADD_DRIVER') {
		if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

		const { username, password } = data;
		const driver = await prisma.drivers.create({ data: { username, password } });
		await prisma.authorized_drivers.create({ data: { v_id: vid, d_id: driver.id } });

		ws.send(JSON.stringify({ op: op + '_SUCCESS', data: driver }));
	} else if (op === 'DELETE_DRIVER') {
		const { id } = data;
		await prisma.drivers.delete({ where: { id } });
		await prisma.authorized_drivers.deleteMany({ where: { d_id: id } });

		ws.send(JSON.stringify({ op: op + '_SUCCESS' }));
	} else if (op === 'EDIT_DRIVER') {
		if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));
		const { id } = data;
		await prisma.authorized_drivers.updateMany({ where: { d_id: id }, data: { v_id: vid } });

		ws.send(JSON.stringify({ op: op + '_SUCCESS' }));
	}
}
