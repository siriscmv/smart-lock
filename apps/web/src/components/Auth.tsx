import { useEffect, useState } from 'react';
import Button from '@components/Button';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { listenOnce } from 'src/utils/listner';

interface AuthProps {
	type: 'OWNER' | 'DRIVER';
	overrideFetchURL?: string;
	overrideTitle?: string;
}

const Auth = (props: AuthProps) => {
	const [username, setUsername] = useState<string | null>(null);
	const [password, setPassword] = useState<string | null>(null);
	const [vid, setVID] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (!window.ws) window.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
	}, []);

	const router = useRouter();

	return (
		<div className='flex flex-col m-4 p-4 justify-between text-black bg-white rounded-md'>
			<h2 className='font-bold text-center text-3xl uppercase'>{props.overrideTitle ?? 'Login'}</h2>
			<div className='flex flex-col p-2 m-2'>
				<div className=''>
					<div className='text-left font-semibold'>Username</div>
					<input
						onChange={(e) => setUsername(e.target.value)}
						placeholder='Enter username here'
						className='bg-black rounded-md text-white m-2 p-2'
						type='text'
					/>
				</div>
				<div className=''>
					<div className='text-left font-semibold'>Password</div>
					<input
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Enter password here'
						className='bg-black rounded-md text-white m-2 p-2'
						type='password'
					/>
				</div>
				{props.type === 'DRIVER' ? (
					<div className=''>
						<div className='text-left font-semibold'>Vehicle ID</div>
						<input
							onChange={(e) => setVID(parseInt(e.target.value))}
							placeholder='Enter vehicle ID here'
							className='bg-black rounded-md text-white m-2 p-2'
							type='number'
						/>
					</div>
				) : (
					<></>
				)}
			</div>
			<Button
				run={() => {
					const ob = {
						op: 'IDENTIFY',
						data: {
							type: props.type,
							username,
							password,
							associated_vehicle: vid
						}
					};

					listenOnce((msg) => {
						const d = JSON.parse(msg.data);
						if (!d.auth) {
							toast.error('Failed to login');
							return;
						}
						localStorage.setItem('auth', d.auth);
						router.push(`/dashboard/${props.type.toLowerCase()}`);
					});

					window.ws?.send(JSON.stringify(ob));
				}}
				text='Login'
			/>
		</div>
	);
};

export default Auth;
