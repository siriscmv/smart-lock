import Button from '@components/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { listenOnce } from 'src/utils/listner';

export default function Password() {
	const [password, setPassword] = useState('');
	const [vid, setVid] = useState<number>(0); //TODO: Multiple single-user passwords, use proper DB

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
							op: 'ADD_OTP',
							data: {
								password,
								associated_vehicle: vid
							},
							auth: localStorage.getItem('auth')
						};

						listenOnce((msg) => {
							const d = JSON.parse(msg.data);
							if (d.op === 'ADD_OTP_SUCCESS') toast.success('Done!');
							else toast.error('Something went wrong');
						});

						window.ws?.send(JSON.stringify(ob));
					}}
					text={'Set'}
				/>
			</div>
		</div>
	);
}
