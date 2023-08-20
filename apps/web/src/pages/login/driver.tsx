import Auth from '@components/Auth';
import Link from 'next/link';

export default function DriverLogin() {
	return (
		<div className='flex flex-col text-center'>
			<Auth type='DRIVER' />
			<Link href='/ble' className='text-primary font-medium'>
				No internet? Click here
			</Link>
		</div>
	);
}
