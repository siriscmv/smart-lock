import Button from '@components/Button';

export default function Home() {
	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-5xl font-bold mb-12'>Smart Lock</h1>
			<div className='flex flex-row items-center justify-center'>
				<Button href='/dashboard/owner' text='Owner' />
				<Button href='/dashboard/driver' text='Driver' />
			</div>
		</div>
	);
}
