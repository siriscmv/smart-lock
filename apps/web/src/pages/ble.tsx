import Button from '@components/Button';
import { useEffect, useState } from 'react';

const SERVICE_UUID = '00000000-0000-1000-8000-00123456789a';
const CHARACTERISTIC_UUID = '00000000-0000-1000-8000-00123456789b';

export default function Home() {
	const [password, setPassword] = useState('');
	const [action, setAction] = useState<string>('UNLOCK');

	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-5xl font-bold mb-12'>Connect to Lock via BT</h1>
			<div className='flex flex-row items-center justify-center'>
				<div className='flex flex-col m-4 p-4 justify-between text-black bg-white rounded-md'>
					<div className='flex flex-col p-2 m-2'>
						<div className=''>
							<div className='text-left font-semibold'>Password</div>
							<input
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Enter password here'
								className='bg-black rounded-md text-white m-2 p-2'
								type='password'
							/>
						</div>
						<div className=''>
							<div className='text-left font-semibold'>Action</div>
							<input onChange={(e) => setAction(e.target.value)} type='radio' id='LOCK' name='action' value='LOCK' />
							<label htmlFor='LOCK'>Lock</label>
							<br />
							<input
								onChange={(e) => setAction(e.target.value)}
								type='radio'
								id='UNLOCK'
								name='action'
								value='UNLOCK'
								defaultChecked
							/>
							<label htmlFor='UNLOCK'>Unlock</label>
							<br />
						</div>
					</div>
					<Button
						run={async () => {
							//@ts-ignore
							const device = await navigator.bluetooth.requestDevice({
								acceptAllDevices: true,
								optionalServices: [SERVICE_UUID]
							});
							const server = await device.gatt.connect();
							const service = await server.getPrimaryService(SERVICE_UUID);
							const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
							return await characteristic.writeValue(new TextEncoder().encode(`${password}|${action}`));
						}}
						text={action}
					/>
				</div>
			</div>
		</div>
	);
}
