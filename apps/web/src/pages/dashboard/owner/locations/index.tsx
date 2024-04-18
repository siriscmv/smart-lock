import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listenOnce } from 'src/utils/listner';

export default function Owner() {
	const [vehicles, setVehicles] = useState<number[]>([]);
	useEffect(() => {
		listenOnce((msg) => {
			const { op, data } = JSON.parse(msg.data);
			if (op === 'ALL_VEHICLES') {
				setVehicles(data);
			}
		});
		window.ws!.send(JSON.stringify({ op: 'GET_ALL_VEHICLES', auth: localStorage.getItem('auth') }));
	}, []);

	return (
		<div className='flex flex-col'>
			<span>Choose a vehicle</span>
			<div className='flex flex-col'>
				{vehicles.map((vehicle) => (
					<Link key={vehicle} href={`./locations/${vehicle}`} className='text-primary hover:underline'>
						{vehicle}
					</Link>
				))}
			</div>
		</div>
	);
}
