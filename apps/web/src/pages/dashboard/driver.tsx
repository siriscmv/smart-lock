import Button from '@components/Button';
import { Map } from '@components/Map';
import { useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { toast } from 'react-hot-toast';
import { getLatLong } from 'src/utils/geocoder';
import { listenOnce } from 'src/utils/listner';
import { useInterval } from 'usehooks-ts';

const SERVICE_UUID = '00000000-0000-1000-8000-00123456789a';
const CHARACTERISTIC_UUID = '00000000-0000-1000-8000-00123456789c';

export default function Driver() {
	const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true
		},
		watchPosition: true,
		userDecisionTimeout: 15_000
	});

	const [simulation, setSimulation] = useState<{ lat: number; lng: number } | null>(null);

	const lat = simulation?.lat ?? coords?.latitude ?? 0;
	const lng = simulation?.lng ?? coords?.longitude ?? 0;

	useInterval(() => {
		// Advertise location to server for autolocking feature
		const payload = {
			op: 'CURRENT_LOCATION',
			data: {
				lat,
				lon: lng
			},
			auth: localStorage.getItem('auth')
		};

		window.ws!.send(JSON.stringify(payload));
	}, 5_000);

	if (!isGeolocationEnabled) return <span className='text-danger text-2xl font-bold'>Geolocation is not enabled</span>;
	if (!isGeolocationAvailable || !coords)
		return <span className='text-danger text-2xl font-bold'>Geolocation is not available</span>;

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
							let trigger_ble = true;
							toast.promise(
								new Promise<string>(async (resolve, reject) => {
									listenOnce((msg) => {
										const d = JSON.parse(msg.data);

										if (d.op.endsWith('OK')) resolve(d.msg ?? `${b}ed`);
										else {
											reject(d.msg ?? d.error ?? `Failed to ${b.toLowerCase()}`);
											trigger_ble = false;
										}
									});

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

									await new Promise((r) => setTimeout(r, 1000));
									if (!trigger_ble) return;

									// Trigger the 2nd part of the handshake (ble)
									//@ts-ignore
									const device = await navigator.bluetooth.requestDevice({
										acceptAllDevices: true,
										optionalServices: [SERVICE_UUID]
									});
									const server = await device.gatt.connect();
									const service = await server.getPrimaryService(SERVICE_UUID);
									const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
									await characteristic.writeValue(new TextEncoder().encode('complet_handshak')); // This text is not relevant
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
