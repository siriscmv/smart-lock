import { Toaster as HotToast } from 'react-hot-toast';

export default function Toaster() {
	return (
		<HotToast
			position='top-center'
			reverseOrder={true}
			toastOptions={{
				duration: 6_000,
				className: 'text-center',
				loading: {
					style: {
						background: '#000748',
						color: '#5465ff'
					}
				},
				blank: {
					style: {
						background: '#000748',
						color: '#5465ff'
					}
				},
				success: {
					style: {
						background: '#074800',
						color: '#63ff52'
					}
				},
				error: {
					style: {
						background: '#480007',
						color: '#ff5263'
					}
				}
			}}
		/>
	);
}
