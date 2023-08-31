import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Owner() {
	const [vehicles, setVehicles] = useState<number[]>([]);
	useEffect(() => {
		window.ws!.addEventListener(
			'message',
			(msg) => {
				const { op, data } = JSON.parse(msg.data);
				if (op === 'ALL_VEHICLES') {
					setVehicles(data);
				}
			},
			{ once: true }
		);
		window.ws!.send(JSON.stringify({ op: 'GET_ALL_VEHICLES', auth: window.auth }));
	}, []);

	return (
		<>
			{vehicles.map((vehicle) => (
				<Link key={vehicle} href={`./locations/${vehicle}`} className='text-primary hover:underline'>
					{vehicle}
				</Link>
			))}
		</>
	);
}
