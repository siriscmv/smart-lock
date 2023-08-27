import Link from 'next/link';

export default function Owner() {
	return (
		<div className='flex flex-col text-center'>
			<div className='flex flex-col text-xl'>
				<span className='text-2xl font-bold mb-6'>Owner</span>
				<Link href='/dashboard/owner/logs' className='text-primary font-medium'>
					View Logs
				</Link>
				<Link href='/dashboard/owner/password' className='text-primary font-medium'>
					Set bypass password
				</Link>
				<Link href='/dashboard/owner/locations' className='text-primary font-medium'>
					Locations
				</Link>
				<Link href='/dashboard/owner/users' className='text-primary font-medium'>
					Users
				</Link>
			</div>
		</div>
	);
}
