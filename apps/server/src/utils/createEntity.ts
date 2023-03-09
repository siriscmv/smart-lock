import type { drivers, owners } from '@prisma/client';
import prisma from './prisma.js';

export async function createOnwer(data: Omit<owners, 'id'>) {
	const id =
		((
			await prisma.owners.findFirst({
				orderBy: {
					id: 'desc'
				}
			})
		)?.id ?? 2000) + 1;

	return await prisma.owners.create({
		data: {
			id,
			...data
		}
	});
}

export async function createDriver(data: Omit<drivers, 'id'>) {
	const id =
		((
			await prisma.drivers.findFirst({
				orderBy: {
					id: 'desc'
				}
			})
		)?.id ?? 3000) + 1;

	return await prisma.drivers.create({
		data: {
			id,
			...data
		}
	});
}
