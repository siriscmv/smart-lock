import Button from '@components/Button';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Data {
	distance: number;
	d_id: number;
	v_id: number;
	action: 'LOCKED' | 'UNLOCKED' | 'UNLOCK_REJECTED' | 'FAIL';
	timestamp: number;
}
//TODO: Also show previous logs

export default function Owner() {
	const [logs, setLogs] = useState<Data[]>([]);
	useEffect(() => {
		window.ws!.onmessage = (msg: MessageEvent<string>) => {
			const log = JSON.parse(msg.data);
			if (log.op === 'ACTION_LOG') setLogs((logs) => [log.data, ...logs]);
		};
	}, []);

	const [password, setPassword] = useState('');
	const [vid, setVid] = useState<number>(0);

	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl'>
				<span className='text-2xl font-bold mb-6'>Set bypass password</span>
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
						<div className='text-left font-semibold'>Vehicle</div>
						<input
							onChange={(e) => setVid(parseInt(e.target.value, 10))}
							placeholder='Enter vehicle id here'
							className='bg-black rounded-md text-white m-2 p-2'
							type='number'
						/>
					</div>
				</div>
				<Button
					run={async () => {
						const ob = {
							op: 'SET_BYPASS_PWD',
							data: {
								password,
								associated_vehicle: vid
							}
						};

						window.ws?.addEventListener(
							'message',
							(msg) => {
								const d = JSON.parse(msg.data);
								if (d.op === 'SET_BYPASS_PWD_SUCCESS') toast.success('Done!');
								else toast.error('Something went wrong');
							},
							{ once: true }
						);

						window.ws?.send(JSON.stringify(ob));
					}}
					text={'Set'}
				/>
			</div>
			<div className='flex flex-col text-xl'>
				<span className='text-2xl font-bold mb-6'>Logs</span>
				<div className='grid grid-cols-5 grid-rows-1 text-primary text-xl font-bold'>
					<span>Driver</span>
					<span>Vehicle</span>
					<span>Action</span>
					<span>Distance</span>
					<span>Time</span>
				</div>
				<div className='flex flex-col'>
					{logs.map((log) => {
						return (
							<div className='grid grid-cols-5 grid-rows-1' key={log.timestamp}>
								<span>{log.d_id}</span>
								<span>{log.v_id}</span>
								<span>{log.action}</span>
								<span>{log.distance}</span>
								<span>{log.timestamp}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
