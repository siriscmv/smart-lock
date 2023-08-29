import GoogleMap from 'google-maps-react-markers';
import { useEffect, useRef, useState } from 'react';
import Marker from './Marker';

interface MapProps {
	center: {
		lat: number;
		lng: number;
	};
	lat: number;
	lng: number;
	zoom: number;
	vehicleId?: number;
	markers: { lat: number; lng: number }[];
}

export const Map = ({ center, zoom, lat, lng, markers: initialMarkers, vehicleId }: MapProps) => {
	const mapRef = useRef<any>(null);
	const [mapReady, setMapReady] = useState(false);
	const [markers, setMarkers] = useState(initialMarkers);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;

		mapRef.current.addListener('click', ({ latLng }: any) => {
			const lat = latLng.lat();
			const lng = latLng.lng();

			window.ws!.send(
				JSON.stringify({
					op: 'ADD_STOP',
					auth: window.auth,
					data: { location: { lat, lng }, associated_vehicle: vehicleId }
				})
			);
			setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
		});
	}, [mapReady, mapRef]);

	return (
		<div style={{ height: '75vh', width: '75vw' }}>
			<GoogleMap
				apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
				bootstrapURLKeys={{ key: '' }}
				defaultCenter={center}
				defaultZoom={zoom}
				//@ts-ignore
				onGoogleApiLoaded={({ map }) => {
					mapRef.current = map;
					setMapReady(true);
				}}
			>
				<Marker lat={lat} lng={lng} markerId='You are here' src='/marker-pin-red.png' />
				{markers.map((marker, index) => (
					<Marker key={index} lat={marker.lat} lng={marker.lng} markerId={index.toString()} draggable />
				))}
			</GoogleMap>
		</div>
	);
};
