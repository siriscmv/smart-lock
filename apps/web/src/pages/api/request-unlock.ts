import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).end();

	const { lat, lon } = req.body;
	if (!lat || !lon) return res.status(400).end();

	//TODO: get v_id, d_id here, check if driver is authorized to use that vehicle
	//TODO: Then using v_id get the coords from DB

	const distance = getDistance(lat, lon, 12.7500413, 80.2002732);
	if (distance < 0.01) {
		//TODO: Unlock here
		return res.status(200).json({
			message: `Unlocked! You were ${humanize(distance)} away from the destination`
		});
	}

	return res.status(403).json({
		message: `You are ${humanize(distance)} away from the destination`
	});
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
