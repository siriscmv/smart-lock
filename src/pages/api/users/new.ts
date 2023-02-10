import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end();
	const { username, password } = req.body;
	//TODO: Check if owner here

	const user = await prisma.users.create({
		username,
		password
	});

	return res.status(200).json(user);
}
