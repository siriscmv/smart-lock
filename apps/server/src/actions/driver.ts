import connections from '../utils/connections.js';
import type WebSocket from 'ws';
import prisma from '../utils/prisma.js';

export default async function driver(ws: WebSocket, msg: string) {
	const {
		op,
		auth,
		data: { lat, lon }
	} = JSON.parse(msg);
	if (op !== 'REQUEST_UNLOCK' && op !== 'REQUEST_LOCK') return;

	const vid =
		Array.from(connections.values()).find((c) => c.auth === auth && c.type === 'DRIVER')?.associated_vehicle ?? null;
	if (!vid) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const vehicle = Array.from(connections.values()).find((c) => c.id === vid && c.type === 'VEHICLE');
	if (!vehicle) return ws.send(JSON.stringify({ op: op + '_FAIL' }));

	const destinations = await prisma.vehicle_locations.findMany({ where: { id: vid } });
	const distance = Math.min(...destinations.map((d) => getDistance(lat, lon, d.latitude, d.longitude)));

	if (distance > 0.01) {
		return ws.send(
			JSON.stringify({
				op: op + '_FAIL',
				msg: `You are ${humanize(distance)} away from the destination`
			})
		);
	}

	vehicle.ws.once('message', (msg) => {
		const data = JSON.parse(msg.toString());
		if (data.op.endsWith('OK'))
			ws.send(
				JSON.stringify({
					op: op + '_OK',
					msg: `Unlocked! You were ${humanize(distance)} away from the destination`
				})
			);
		else
			ws.send(
				JSON.stringify({
					op: op + '_FAIL'
				})
			);
	});

	vehicle.ws.send(
		JSON.stringify({
			op: op.split('_')[1]
		})
	);
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
	const RADIUS = 6371; // Radius of the earth in km
	const latDiff = deg2rad(lat2 - lat1);
	const LonDiff = deg2rad(lon2 - lon1);
	const a =
		Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(LonDiff / 2) * Math.sin(LonDiff / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return RADIUS * c;
};
const deg2rad = (deg: number) => {
	return deg * (Math.PI / 180);
};
const humanize = (distanceInKM: number) => {
	if (distanceInKM > 1) return `${distanceInKM.toFixed(3)} km`;
	else return `${(distanceInKM * 1000).toFixed(1)} m`;
};
