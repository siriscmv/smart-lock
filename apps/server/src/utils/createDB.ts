import prisma from './prisma.js';

(async () => {
	await prisma.authorized_drivers.create({ data: { v_id: 1001, d_id: 1001 } });
	await prisma.vehicles.create({ data: { v_id: 1001, name: 'TN-07-AB-0237' } });
	await prisma.drivers.create({ data: { id: 3001, username: 'john', password: 'john123' } });
	await prisma.owners.create({ data: { id: 2001, username: 'admin', password: 'admin123' } });

	await prisma.vehicle_locations.create({
		data: { id: 10002, name: 'SSN College CSE', latitude: 12.751336, longitude: 80.1971847, v_id: 1001 }
	});

	console.log('Done!');
})();
