import Button from '@components/Button';
import { useGeolocated } from 'react-geolocated';
import toast from 'react-hot-toast';
import { Map } from '@components/Map';
import { useEffect, useState } from 'react';
import { listenOnce } from 'src/utils/listner';

//TODO: Add delete/remove marker option here too
export default function Demo() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: false,
		userDecisionTimeout: 15_000
	});
	const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });

	useEffect(() => {
		if (coords) setLatLng({ lat: coords.latitude, lng: coords.longitude });
	}, [coords]);
	useEffect(() => {
		if (!window.ws) window.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
		window.ws.onopen = () => {
			const ob = {
				op: 'IDENTIFY',
				data: {
					type: 'DEMO'
				}
			};
			window.ws!.send(JSON.stringify(ob));
		};
	}, []);

	const [markers, setMarkers] = useState([]);

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl mb-6'>
				<div className='mb-6'>
					<Map
						setDemoCoords={setLatLng}
						markers={markers}
						setMarkers={setMarkers}
						center={latLng}
						zoom={20}
						lat={latLng.lat}
						lng={latLng.lng}
					/>
				</div>
				<span className='font-bold'>Note: This view combines both driver and owner view for showcase purposes</span>
			</div>
			<div className='flex flex-row justify-center'>
				{['Lock', 'Unlock'].map((b) => (
					<Button
						key={b}
						run={() => {
							toast.promise(
								new Promise<string>((resolve, reject) => {
									listenOnce((msg) => {
										const d = JSON.parse(msg.data);

										if (d.op.endsWith('OK')) resolve(d.msg ?? `${b}ed`);
										else reject(d.msg ?? `Failed to ${b.toLowerCase()}`);
									});

									window.ws!.send(
										JSON.stringify({
											op: `REQUEST_${b.toUpperCase()}`,
											data: {
												lat: latLng.lat,
												lon: latLng.lng,
												isDemo: true
											}
										})
									);
								}),
								{
									loading: `Requesting ${b.toLowerCase()}...`,
									success: (data) => data,
									error: (data) => data
								}
							);
						}}
						text={`Request ${b}`}
					/>
				))}
			</div>
		</div>
	);
}
