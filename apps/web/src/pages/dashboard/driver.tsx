import Button from '@components/Button';
import { Map } from '@components/Map';
import { useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { toast } from 'react-hot-toast';
import { getLatLong } from 'src/utils/geocoder';

export default function Driver() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});
	const [simulation, setSimulation] = useState<{ lat: number; lng: number } | null>(null);

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

	const lat = simulation?.lat ?? coords.latitude;
	const lng = simulation?.lng ?? coords.longitude;

	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl mb-6'>
				<div className='mb-6'>
					<Map markers={null} center={{ lat, lng }} zoom={20} lat={lat} lng={lng} />
				</div>
				<span>Your Latitude: {lat}</span>
				<span>Your Longitude: {lng}</span>
			</div>
			<div className='flex flex-row justify-center'>
				<Button
					text='Simulate location'
					run={async () => {
						const query = window.prompt('Enter a location to simulate');
						const result = await getLatLong(query!);
						setSimulation(result);
					}}
				/>
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
												lat,
												lon: lng
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
