import Button from '@components/Button';
import { useGeolocated } from 'react-geolocated';
import toast from 'react-hot-toast';
import { Map } from '@components/Map';
import { useEffect, useState } from 'react';

//TODO: Add delete/remove marker option here too
export default function Demo() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});

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
						markers={markers}
						setMarkers={setMarkers}
						center={{ lat: coords.latitude, lng: coords.longitude }}
						zoom={20}
						lat={coords.latitude}
						lng={coords.longitude}
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
									window.ws!.addEventListener(
										'message',
										(msg) => {
											const d = JSON.parse(msg.data);

											if (d.op.endsWith('OK')) resolve(d.msg ?? `${b}ed`);
											else reject(d.msg ?? `Failed to ${b.toLowerCase()}`);
										},
										{ once: true }
									);

									window.ws!.send(
										JSON.stringify({
											op: `REQUEST_${b.toUpperCase()}`,
											data: {
												lat: coords.latitude,
												lon: coords.longitude,
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
