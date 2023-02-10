import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end();

	const { username, password, type } = req.body;

	if (type === 'driver') {
		//TODO: Login driver
	} else if (type === 'owner') {
		if (username === 'root' && password === 'ssn') {
			//TODO: Create session here
			return res.status(200).json({ message: 'Login successful' });
		}
		return res.status(401).json({ message: 'Invalid credentials' });
	}
}
