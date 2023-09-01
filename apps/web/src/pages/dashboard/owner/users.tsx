import { useEffect, useState } from 'react';
import unique from 'src/utils/unique';

export default function Owner() {
	const [drivers, setDrivers] = useState<{ driver: number; vehicle: number }[]>([]);

	useEffect(() => {
		window.ws!.addEventListener(
			'message',
			(msg) => {
				const d = JSON.parse(msg.data);
				if (d.op === 'GET_DRIVERS_SUCCESS') {
					setDrivers((prevDrivers) => unique([...prevDrivers, ...d.data], 'driver'));
				}
			},
			{ once: true }
		);
		window.ws!.send(JSON.stringify({ op: 'GET_DRIVERS', auth: localStorage.getItem('auth') }));
	}, []);

	return (
		<div className='flex flex-col'>
			<span>Drivers</span>
			<div className='flex flex-col items-center'>
				{drivers.map((driver) => (
					<div className='flex flex-row items-center space-x-4'>
						<span>{driver.driver}</span>
						<span>{driver.vehicle}</span>
						<span
							className='text-primary cursor-pointer'
							onClick={() => {
								const newVehicle = parseInt(window.prompt('Enter new vehicle id') ?? '');
								if (isNaN(newVehicle)) return;

								setDrivers((drivers) =>
									unique(
										[
											...drivers.filter((d) => d.driver !== driver.driver),
											{ driver: driver.driver, vehicle: newVehicle }
										],
										'driver'
									)
								);
								window.ws!.send(
									JSON.stringify({
										op: 'EDIT_DRIVER',
										data: { id: driver.driver, associated_vehicle: newVehicle },
										auth: localStorage.getItem('auth')
									})
								);
							}}
						>
							Edit
						</span>
						<span
							onClick={() => {
								setDrivers((drivers) => drivers.filter((d) => d.driver !== driver.driver));
								window.ws!.send(
									JSON.stringify({
										op: 'DELETE_DRIVER',
										data: { id: driver.driver },
										auth: localStorage.getItem('auth')
									})
								);
							}}
							className='font-bold text-danger cursor-pointer'
						>
							X
						</span>
					</div>
				))}
			</div>
			<span
				className='mt-4 text-primary cursor-pointer'
				onClick={() => {
					const username = window.prompt('Enter username:');
					const password = window.prompt('Enter password:');
					const associated_vehicle = parseInt(window.prompt('Enter vehicle ID:') ?? '');
					if (isNaN(associated_vehicle)) return;

					window.ws!.addEventListener(
						'message',
						({ data: msgData }) => {
							const data = JSON.parse(msgData);
							if (data.op === 'ADD_DRIVER_SUCCESS') {
								const { id } = data.data;
								setDrivers((drivers) => unique([...drivers, { driver: id, vehicle: associated_vehicle }], 'driver'));
							}
						},
						{ once: true }
					);
					window.ws!.send(
						JSON.stringify({
							op: 'ADD_DRIVER',
							data: { username, password, associated_vehicle },
							auth: localStorage.getItem('auth')
						})
					);
				}}
			>
				Add new driver
			</span>
		</div>
	);
}
