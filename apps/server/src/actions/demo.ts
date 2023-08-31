import { getDistance, humanize } from '../utils/distance.js';
import prisma from '../utils/prisma.js';
import type WebSocket from 'ws';

const VID = 1001;

export default async function demo(ws: WebSocket, msg: string) {
	const { op, data } = JSON.parse(msg);
	if (op === 'REQUEST_UNLOCK' || op === 'REQUEST_LOCK') {
		// Code for showing demo, does not actually affect the solenoid lock, only calculates distance

		const { lat, lon } = data;
		const destinations = await prisma.demo_locations.findMany({ where: { v_id: VID } });
		const distance = Math.min(...destinations.map((d) => getDistance(lat, lon, d.latitude, d.longitude)));

		if (distance > 0.1) {
			ws.send(
				JSON.stringify({
					op: op + '_FAIL',
					msg: `You are ${humanize(distance)} away from the destination`
				})
			);
		} else {
			ws.send(
				JSON.stringify({
					op: op + '_OK',
					msg: `${op === 'REQUEST_LOCK' ? 'Locked' : 'Unlocked'}! You were ${humanize(
						distance
					)} away from the destination`
				})
			);
		}
	} else if (op === 'UPSERT_STOP') {
		const { lat, lng, id } = data.location;

		let record = null;
		if (id) record = await prisma.demo_locations.update({ data: { latitude: lat, longitude: lng }, where: { id } });
		else record = await prisma.demo_locations.create({ data: { latitude: lat, longitude: lng, v_id: VID } });

		ws.send(JSON.stringify({ op: op + '_SUCCESS', data: { lat, lng, id: record.id } }));
	}
}
