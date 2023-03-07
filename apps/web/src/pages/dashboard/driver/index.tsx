import Button from '@components/Button';
import Toaster from '@components/Toaster';
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
			<Toaster />
			<div className='flex flex-col text-xl'>
				<span>Your Latitude: {coords.latitude}</span>
				<span>Your Longitude: {coords.longitude}</span>
			</div>
			<div className='flex flex-col'>
				<Button
					run={() => {
						toast.promise(
							new Promise<string>((resolve, reject) => {
								fetch('/api/request-unlock', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										lat: coords.latitude,
										lon: coords.longitude
									})
								})
									.then((res) => {
										if (res.status !== 200 && res.status !== 403) reject('Failed to unlock');
										else {
											res.json().then((data) => {
												if (res.ok) resolve(data.message);
												else reject(data.message);
											});
										}
									})
									.catch((_) => reject('Failed to unlock'));
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
