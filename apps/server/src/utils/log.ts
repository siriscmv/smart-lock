import connections from '../utils/connections.js';
import prisma from '../utils/prisma.js';

export interface Data {
	distance: number;
	d_id: number;
	v_id: number;
	action: 'LOCKED' | 'LOCK_REJECTED' | 'UNLOCKED' | 'UNLOCK_REJECTED' | 'FAIL';
}

export default async function log(data: Data) {
	const logData = await prisma.logs.create({ data: { ...data, timestamp: new Date() } });

	connections.forEach((c) => {
		if (c.type !== 'OWNER') return;

		c.ws.send(
			JSON.stringify({
				op: 'ACTION_LOG',
				data: { ...logData, timestamp: logData.timestamp.getTime() }
			})
		);
	});
}
