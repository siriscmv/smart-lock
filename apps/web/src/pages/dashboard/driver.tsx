import Button from '@components/Button';
import { useGeolocated } from 'react-geolocated';
import { toast } from 'react-hot-toast';

export default function Driver() {
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
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl'>
				<span>Your Latitude: {coords.latitude}</span>
				<span>Your Longitude: {coords.longitude}</span>
			</div>
			<div className='flex flex-col'>
				<Button
					run={() => {
						toast.promise(
							new Promise<string>((resolve, reject) => {
								window.ws!.addEventListener(
									'message',
									(msg) => {
										const d = JSON.parse(msg.data);

										if (d.op.endsWith('OK')) resolve(d.msg ?? 'Unlocked');
										else reject(d.msg ?? 'Failed to unlock');
									},
									{ once: true }
								);

								window.ws!.send(
									JSON.stringify({
										op: 'REQUEST_UNLOCK',
										data: {
											lat: coords.latitude,
											lon: coords.longitude
										},
										auth: window.auth
									})
								);
							}),
							{
								loading: 'Requesting unlock...',
								success: (data) => data,
								error: (data) => data
							}
						);
					}}
					text='Request Unlock'
				/>
			</div>
		</div>
	);
}
