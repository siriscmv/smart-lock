import Button from '@components/Button';
import { Map } from '@components/Map';
import { useGeolocated } from 'react-geolocated';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function Driver() {
	const {
		coords: _coords,
		isGeolocationAvailable,
		isGeolocationEnabled
	} = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: false,
		userDecisionTimeout: 15_000
	});
	const [coords, setCoords] = useState({ lat: _coords?.latitude ?? 0, lng: _coords?.longitude ?? 0 });

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl mb-6'>
				<div className='mb-6'>
					<Map
						setDemoCoords={setCoords}
						markers={[]}
						setMarkers={() => {}}
						center={coords}
						zoom={20}
						lat={coords.lat}
						lng={coords.lng}
					/>
				</div>
				<span>Your Latitude: {coords.lat}</span>
				<span>Your Longitude: {coords.lng}</span>
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
												lat: coords.lat,
												lon: coords.lng
											},
											auth: localStorage.getItem('auth')
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
