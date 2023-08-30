import { Map } from '@components/Map';
import { useEffect, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { useRouter } from 'next/router';

export default function Owner() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});
	const router = useRouter();
	const [markers, setMarkers] = useState<{ lat: number; lng: number; id: number }[]>([]);

	useEffect(() => {
		window.ws!.addEventListener(
			'message',
			(msg) => {
				const { op, data } = JSON.parse(msg.data);
				if (op === 'ALL_STOPS') {
					setMarkers((prevMarkers) => [
						...prevMarkers,
						...data.map((d: any) => ({ id: d.id, lat: d.latitude, lng: d.longitude }))
					]);
				}
			},
			{ once: true }
		);
		window.ws!.send(
			JSON.stringify({
				op: 'GET_ALL_STOPS',
				auth: window.auth,
				data: { associated_vehicle: parseInt(router.query.id as string) }
			})
		);
	}, []);

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	return (
		<>
			<Map
				vehicleId={parseInt(router.query.id as string)}
				markers={markers}
				center={{ lat: coords.latitude, lng: coords.longitude }}
				zoom={20}
				lat={coords.latitude}
				lng={coords.longitude}
			/>
		</>
	);
}
