import toast from 'react-hot-toast';
const apiKey = '661ebe905542d767224577ksp74ae91';

export function getLatLong(search: string) {
	return fetch(`https://geocode.maps.co/search?q=${search}&api_key=${apiKey}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			if (data.length === 0) {
				toast.error('Something went wrong');
				return null;
			}
			const lat = parseFloat(data[0].lat);
			const lng = parseFloat(data[0].lon);

			return { lat, lng };
		});
}
