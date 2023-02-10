import Button from '@components/Button';

export default function Home() {
	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-3xl font-bold mb-12'>Smart Lock</h1>
			<div className='flex flex-row'>
				<Button run={() => (window.location.href = '/login/owner')} text='Owner' />
				<Button run={() => (window.location.href = '/login/driver')} text='Driver' />
			</div>
		</div>
	);
}
