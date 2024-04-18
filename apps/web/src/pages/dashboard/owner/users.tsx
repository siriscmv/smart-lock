import { useEffect, useState } from 'react';
import { listenOnce } from 'src/utils/listner';
import unique from 'src/utils/unique';

export default function Owner() {
	const [drivers, setDrivers] = useState<{ driver: number; vehicle: number }[]>([]);

	useEffect(() => {
		listenOnce((msg) => {
			const d = JSON.parse(msg.data);
			if (d.op === 'GET_DRIVERS_SUCCESS') {
				setDrivers((prevDrivers) => unique([...prevDrivers, ...d.data], 'driver'));
			}
		});
		window.ws!.send(JSON.stringify({ op: 'GET_DRIVERS', auth: localStorage.getItem('auth') }));
	}, []);

	return (
		<div className='flex flex-col'>
			<span>Drivers</span>
			<div className='flex flex-col items-center'>
				<div className='grid grid-cols-4 grid-rows-1 w-[50vw] underline'>
					<span>Driver ID</span>
					<span>Vehicle ID</span>
				</div>
				{drivers.map((driver) => (
					<div key={driver.driver} className='grid grid-cols-4 grid-rows-1 w-[50vw]'>
						<span>{driver.driver}</span>
						<span>{driver.vehicle}</span>
						<span
							className='text-primary cursor-pointer hover:underline'
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
							className='font-bold text-danger cursor-pointer hover:underline'
						>
							X
						</span>
					</div>
				))}
			</div>
			<span
				className='mt-4 text-primary cursor-pointer hover:underline'
				onClick={() => {
					const username = window.prompt('Enter username:');
					const password = window.prompt('Enter password:');
					const associated_vehicle = parseInt(window.prompt('Enter vehicle ID:') ?? '');
					if (isNaN(associated_vehicle)) return;

					listenOnce(({ data: msgData }) => {
						const data = JSON.parse(msgData);
						if (data.op === 'ADD_DRIVER_SUCCESS') {
							const { id } = data.data;
							setDrivers((drivers) => unique([...drivers, { driver: id, vehicle: associated_vehicle }], 'driver'));
						}
					});

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
