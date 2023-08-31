import connections from '../utils/connections.js';
import type WebSocket from 'ws';
import prisma from '../utils/prisma.js';
import log, { Data } from '../utils/log.js';
import { getDistance, humanize } from '../utils/distance.js';

export default async function driver(ws: WebSocket, msg: string) {
	const {
		op,
		auth,
		data: { lat, lon }
	} = JSON.parse(msg);
	if (op !== 'REQUEST_UNLOCK' && op !== 'REQUEST_LOCK') return;

	const driver = Array.from(connections.values()).find((c) => c.auth === auth && c.type === 'DRIVER');
	if (!driver) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vid = driver.associated_vehicle ?? null;
	if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vehicle = Array.from(connections.values()).find((c) => c.id === vid && c.type === 'VEHICLE');
	if (!vehicle) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const destinations = await prisma.vehicle_locations.findMany({ where: { v_id: vid } });
	const distance = Math.min(...destinations.map((d) => getDistance(lat, lon, d.latitude, d.longitude)));

	if (distance > 0.1) {
		ws.send(
			JSON.stringify({
				op: op + '_FAIL',
				msg: `You are ${humanize(distance)} away from the destination`
			})
		);

		await log({ v_id: vid, d_id: driver.id, action: (op + '_REJECTED') as Data['action'], distance });
		return;
	}

	vehicle.ws.once('message', async (msg) => {
		const data = JSON.parse(msg.toString());
		if (data.op.endsWith('OK')) {
			ws.send(
				JSON.stringify({
					op: op + '_OK',
					msg: `${op === 'REQUEST_LOCK' ? 'Locked' : 'Unlocked'}! You were ${humanize(
						distance
					)} away from the destination`
				})
			);
			await log({ v_id: vid, d_id: driver.id, action: op === 'REQUEST_LOCK' ? 'LOCKED' : 'UNLOCKED', distance });
		} else {
			ws.send(
				JSON.stringify({
					op: op + '_FAIL'
				})
			);
			await log({ v_id: vid, d_id: driver.id, action: 'FAIL', distance });
		}
	});

	vehicle.ws.send(
		JSON.stringify({
			op: op.split('_')[1]
		})
	);
}
