import connections from '../utils/connections.js';
import type WebSocket from 'ws';
import prisma from '../utils/prisma.js';
import log from '../utils/log.js';
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
	const withDistances = destinations.map((d) => ({
		destination: d,
		distance: getDistance(lat, lon, d.latitude, d.longitude)
	}));
	const distances = withDistances.map((d) => d.distance);
	const distance = Math.min(...distances);
	const closestStop = withDistances.find((d) => d.distance === distance)!.destination;

	if (distance > 0.1) {
		ws.send(
			JSON.stringify({
				op: op + '_FAIL',
				msg: `You are ${humanize(distance)} away from the destination`
			})
		);
		const vehicle = await prisma.vehicles.findFirst({ where: { v_id: vid } });
		const driverFromDB = await prisma.drivers.findFirst({ where: { id: driver.id } });
		await log({
			v_id: vid,
			d_id: driver.id,
			action: `${driverFromDB?.username ?? driver.id.toString()} requested an ${op} for ${
				vehicle?.name ?? vehicle?.v_id.toString()
			}, but was rejected for being ${humanize(distance)} away from the closest stop`
		});
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
			const vehicle = await prisma.vehicles.findFirst({ where: { v_id: vid } })!;
			const driverFromDB = await prisma.drivers.findFirst({ where: { id: driver.id } });
			await log({
				v_id: vid,
				d_id: driver.id,
				action: `${vehicle?.name ?? vid.toString()} was ${op === 'REQUEST_LOCK' ? 'LOCKED' : 'UNLOCKED'} by ${
					driverFromDB?.username ?? driver.id.toString()
				} at ${closestStop.name}`
			});
		} else {
			// Propogate the error
			ws.send(JSON.stringify(data));
			// await log({ v_id: vid, d_id: driver.id, action: 'FAIL' });
		}
	});

	vehicle.ws.send(
		JSON.stringify({
			op: op.split('_')[1]
		})
	);
}
