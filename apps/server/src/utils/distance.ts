export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
	const RADIUS = 6371; // Radius of the earth in km
	const latDiff = deg2rad(lat2 - lat1);
	const LonDiff = deg2rad(lon2 - lon1);
	const a =
		Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(LonDiff / 2) * Math.sin(LonDiff / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return RADIUS * c;
};

export const deg2rad = (deg: number) => {
	return deg * (Math.PI / 180);
};

export const humanize = (distanceInKM: number) => {
	if (distanceInKM > 1) return `${distanceInKM.toFixed(3)} km`;
	else return `${(distanceInKM * 1000).toFixed(1)} m`;
};
