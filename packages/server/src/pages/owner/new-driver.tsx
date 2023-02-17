import Auth from '@components/Auth';

export default function SignUp() {
	return (
		<div className='flex flex-col text-center'>
			<h1 className='text-3xl font-bold mb-12'>Create new user</h1>
			<div className='flex flex-row'>
				<Auth overrideTitle='New Driver' overrideFetchURL='/users/new' type='new_driver' />
			</div>
		</div>
	);
}
