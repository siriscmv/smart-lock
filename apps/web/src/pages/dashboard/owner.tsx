import { useEffect, useState } from 'react';

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
			setLogs([log, ...logs]);
		};
	}, []);

	return (
		<div className='flex flex-col text-center'>
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
