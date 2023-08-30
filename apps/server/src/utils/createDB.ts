import prisma from './prisma.js';

(async () => {
	await prisma.authorized_drivers.create({ data: { v_id: 3001, d_id: 1001 } });
	await prisma.drivers.create({ data: { id: 3001, username: '123', password: '123' } });
	await prisma.owners.create({ data: { id: 2001, username: 'root', password: 'ssn' } });

	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 1.2941664, longitude: 103.7861271, v_id: 3001 }
	});
	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 12.751336, longitude: 80.1971847, v_id: 3001 }
	});
	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 12.7512928, longitude: 80.1971815, v_id: 3001 }
	});
	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 12.7513243, longitude: 80.1971815, v_id: 3001 }
	});
	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 12.7512675, longitude: 80.1971436, v_id: 3001 }
	});
	await prisma.vehicle_locations.create({
		data: { id: 10001, latitude: 12.9460826, longitude: 80.2372305, v_id: 3001 }
	});

	console.log('Done!');
})();
