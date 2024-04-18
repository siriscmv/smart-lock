import { useEffect, useState } from 'react';
import { listenOnce } from 'src/utils/listner';

interface Data {
	distance: number;
	d_id: number;
	v_id: number;
	action: 'LOCKED' | 'UNLOCKED' | 'UNLOCK_REJECTED' | 'FAIL';
	timestamp: number;
}

export default function Owner() {
	const [logs, setLogs] = useState<Data[]>([]);
	useEffect(() => {
		window.ws!.onmessage = (msg: MessageEvent<string>) => {
			const log = JSON.parse(msg.data);
			if (log.op === 'ACTION_LOG') setLogs((logs) => [log.data, ...logs]);
		};

		listenOnce((msg) => {
			const d = JSON.parse(msg.data);
			if (d.op === 'LASTEST_ACTION_LOGS') {
				setLogs((logs) => [...d.data, ...logs]);
			}
		});

		const ob = {
			op: 'GET_LASTEST_ACTION_LOGS',
			data: {
				limit: 50
			},
			auth: localStorage.getItem('auth')
		};
		window.ws!.send(JSON.stringify(ob));
	}, []);

	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl'>
				<span className='text-2xl font-bold mb-6'>Logs</span>
				<div className='grid grid-cols-2 grid-rows-1 text-primary text-xl font-bold'>
					<span>Time</span>
					<span>Action</span>
				</div>
				<div className='flex flex-col text-black'>
					{logs.map((log, index) => {
						const isEvenRow = index % 2 === 0;
						const rowColorClass = isEvenRow ? 'bg-gray-200' : 'bg-gray-100';
						return (
							<div className={`grid grid-cols-2 grid-rows-1 ${rowColorClass}`} key={log.timestamp}>
								<span>{new Date(log.timestamp).toUTCString()}</span>
								<span>{log.action}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
