import GoogleMap from 'siriscmv-gmrm';
import { useEffect, useRef, useState } from 'react';
import Marker from './Marker';
import unique from 'src/utils/unique';

interface MapProps {
	center: {
		lat: number;
		lng: number;
	};
	lat: number;
	lng: number;
	zoom: number;
	vehicleId?: number;
	markers: { lat: number; lng: number; id: number }[] | null;
	setCurrentlyHoveredMarker?: any; //TODO: Fix types + remove ts ignores
	setMarkers?: any;
	setDemoCoords?: any;
	aggressiveDemo?: boolean;
}

export const Map = ({
	center,
	zoom,
	lat,
	lng,
	markers,
	vehicleId,
	setCurrentlyHoveredMarker,
	setMarkers,
	setDemoCoords,
	aggressiveDemo
}: MapProps) => {
	const mapRef = useRef<any>(null);
	const [mapReady, setMapReady] = useState(false);
	const [init, setInit] = useState(false);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;
		if (markers === null) return;
		if (init) return;

		setInit(true);
		mapRef.current.addListener('click', ({ latLng }: any) => {
			const lat = latLng.lat();
			const lng = latLng.lng();

			window.ws!.addEventListener(
				'message',
				({ data: msgData }) => {
					const data = JSON.parse(msgData);
					if (data.op === 'UPSERT_STOP_SUCCESS') {
						const { lat, lng, id } = data.data;
						//@ts-ignore
						setMarkers((prevMarkers) => unique([...prevMarkers, { lat, lng, id }], 'id'));
					}
				},
				{ once: true }
			);
			window.ws!.send(
				JSON.stringify({
					op: 'UPSERT_STOP',
					auth: localStorage.getItem('auth'),
					data: { location: { lat, lng }, associated_vehicle: vehicleId }
				})
			);
		});
	}, [mapReady, mapRef, markers]);

	return (
		<div className='md:w-[75vw] w-[90vw] h-[75vh]'>
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
				<Marker
					lat={lat}
					lng={lng}
					markerId={0}
					src='/marker-pin-red.png'
					draggable={setDemoCoords !== undefined}
					//@ts-ignore
					onDrag={(e, { latLng }) => {
						if (!aggressiveDemo) return;
						if (!e || setDemoCoords === undefined) return;
						setDemoCoords(latLng);
					}}
					//@ts-ignore
					onDragEnd={(e, { latLng }) => {
						if (aggressiveDemo) return;
						if (!e || setDemoCoords === undefined) return;
						setDemoCoords(latLng);
					}}
				/>
				{markers?.map((marker) => (
					<Marker
						key={marker.id}
						lat={marker.lat}
						lng={marker.lng}
						markerId={marker.id} //@ts-ignore
						onMouseEnter={() => setCurrentlyHoveredMarker?.(marker.id)}
						onMouseLeave={() => setCurrentlyHoveredMarker?.(null)}
						draggable //@ts-ignore
						onDragEnd={(e, { latLng }) => {
							if (!e) return;
							const { lat, lng } = latLng;

							window.ws!.addEventListener(
								'message',
								({ data: msgData }) => {
									const data = JSON.parse(msgData);
									if (data.op === 'UPSERT_STOP_SUCCESS') {
										const { lat, lng, id } = data.data;
										//@ts-ignore
										setMarkers((prevMarkers) =>
											unique([...prevMarkers.filter((p: any) => p.id !== id), { lat, lng, id }], 'id')
										);
									}
								},
								{ once: true }
							);
							window.ws!.send(
								JSON.stringify({
									op: 'UPSERT_STOP',
									auth: localStorage.getItem('auth'),
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
