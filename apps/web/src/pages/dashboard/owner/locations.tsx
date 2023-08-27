import { Map } from '@components/Map';
import { useGeolocated } from 'react-geolocated';

export default function Owner() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	return (
		<>
			<Map
				markers={TEMP_MARKERS}
				center={{ lat: coords.latitude, lng: coords.longitude }}
				zoom={20}
				lat={coords.latitude}
				lng={coords.longitude}
			/>
		</>
	);
}

const TEMP_MARKERS = [
	{ lat: 12.750407, lng: 80.198674 },
	{ lat: 12.757888, lng: 80.207911 },
	{ lat: 12.900735, lng: 80.22841 }
];
