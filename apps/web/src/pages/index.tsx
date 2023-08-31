import Button from '@components/Button';

export default function Home() {
	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-5xl font-bold mb-12'>Smart Lock</h1>
			<div className='flex flex-row items-center justify-center'>
				<Button href='/login/owner' text='Owner' />
				<Button href='/login/driver' text='Driver' />
				<Button href='/demo' text='Demo' />
			</div>
		</div>
	);
}
