import Button from '@components/Button';

export default function Owner() {
	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-3xl font-bold mb-12'>Owner control pannel</h1>
			<div className='flex flex-row'>
				<Button run={() => (window.location.href = '/owner/list-vehicles')} text='List vehicles' />
				<Button run={() => (window.location.href = '/owner/new-driver')} text='New Driver' />
				<Button run={() => (window.location.href = '/owner/track-vehicles')} text='Track vehicles' />
			</div>
		</div>
	);
}
