import prisma from './prisma.js';
export async function createVehicle(data) {
    const id = ((await prisma.vehicles.findFirst({
        orderBy: {
            id: 'desc'
        }
    }))?.id ?? 1000) + 1;
    return await prisma.vehicles.create({
        data: {
            id,
            ...data
        }
    });
}
export async function createOnwer(data) {
    const id = ((await prisma.owners.findFirst({
        orderBy: {
            id: 'desc'
        }
    }))?.id ?? 2000) + 1;
    return await prisma.owners.create({
        data: {
            id,
            ...data
        }
    });
}
export async function createDriver(data) {
    const id = ((await prisma.drivers.findFirst({
        orderBy: {
            id: 'desc'
        }
    }))?.id ?? 3000) + 1;
    return await prisma.drivers.create({
        data: {
            id,
            ...data
        }
    });
}
