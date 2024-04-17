import { Map } from '@components/Map';
import { useEffect, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { useRouter } from 'next/router';
import unique from 'src/utils/unique';

export default function Owner() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});
	const router = useRouter();
	const [markers, setMarkers] = useState<{ lat: number; lng: number; id: number; name: string }[]>([]);
	const [currentlyHoveredMarker, setCurrentlyHoveredMarker] = useState<number | null>(null);

	useEffect(() => {
		window.ws!.addEventListener(
			'message',
			(msg) => {
				const { op, data } = JSON.parse(msg.data);
				if (op === 'ALL_STOPS') {
					setMarkers((prevMarkers) =>
						unique(
							[
								...prevMarkers,
								...data.map((d: any) => ({ id: d.id, lat: d.latitude, lng: d.longitude, name: d.name }))
							],
							'id'
						)
					);
				}
			},
			{ once: true }
		);
		window.ws!.send(
			JSON.stringify({
				op: 'GET_ALL_STOPS',
				auth: localStorage.getItem('auth'),
				data: { associated_vehicle: parseInt(router.query.id as string) }
			})
		);
	}, []);

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	return (
		<div className='flex flex-col items-center'>
			<Map
				setCurrentlyHoveredMarker={setCurrentlyHoveredMarker}
				setMarkers={setMarkers}
				vehicleId={parseInt(router.query.id as string)}
				markers={markers}
				center={{ lat: coords.latitude, lng: coords.longitude }}
				zoom={20}
				lat={coords.latitude}
				lng={coords.longitude}
			/>
			<div className='flex flex-col items-center mt-6'>
				<div className={'grid grid-cols-4 grid-rows-1 w-[50vw] underline'}>
					<span>ID</span>
					<span>Name</span>
					<span>LAT</span>
					<span>LON</span>
				</div>
				{markers.map((marker) => (
					<div
						className={`grid grid-cols-4 grid-rows-1 w-[50vw] ${
							currentlyHoveredMarker === marker.id ? 'text-primary' : 'text-white'
						}`}
					>
						<span>{marker.id}</span>
						<span>{marker.name}</span>
						<span>{marker.lat.toFixed(4)}</span>
						<span>{marker.lng.toFixed(4)}</span>
						<button
							className='text-danger font-black cursor-pointer hover:underline'
							onClick={() => {
								window.ws!.addEventListener(
									'message',
									(msg) => {
										const { op } = JSON.parse(msg.data);
										if (op === 'REMOVE_STOP_SUCCESS') {
											setMarkers((prevMarkers) => unique([...prevMarkers.filter((m) => m.id !== marker.id)], 'id'));
										}
									},
									{ once: true }
								);
								window.ws!.send(
									JSON.stringify({
										op: 'REMOVE_STOP',
										auth: localStorage.getItem('auth'),
										data: { location: { id: marker.id } }
									})
								);
							}}
						>
							X
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
