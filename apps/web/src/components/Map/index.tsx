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
	markers: { lat: number; lng: number; id: number }[];
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

			window.ws!.addEventListener(
				'message',
				({ data: msgData }) => {
					const data = JSON.parse(msgData);
					if (data.op === 'UPSERT_STOP_SUCCESS') {
						const { lat, lng, id } = data.data;
						setMarkers((prevMarkers) => [...prevMarkers, { lat, lng, id }]);
					}
				},
				{ once: true }
			);
			window.ws!.send(
				JSON.stringify({
					op: 'UPSERT_STOP',
					auth: window.auth,
					data: { location: { lat, lng }, associated_vehicle: vehicleId }
				})
			);
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
				<Marker lat={lat} lng={lng} markerId={0} src='/marker-pin-red.png' />
				{markers.map((marker) => (
					<Marker
						key={marker.id}
						lat={marker.lat}
						lng={marker.lng}
						markerId={marker.id}
						draggable //@ts-ignore
						onDragEnd={(e, { latLng }) => {
							if (!e) return;
							const { lat, lng } = latLng;

							window.ws!.send(
								JSON.stringify({
									op: 'UPSERT_STOP',
									auth: window.auth,
									data: { location: { lat, lng, id: marker.id } }
								})
							);
						}}
					/>
				))}
			</GoogleMap>
		</div>
	);
};
