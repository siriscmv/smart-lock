import GoogleMap from 'google-maps-react-markers';
import { useRef, useState } from 'react';
import Marker from './Marker';

interface MapProps {
	center: {
		lat: number;
		lng: number;
	};
	lat: number;
	lng: number;
	zoom: number;
	markers: { lat: number; lng: number }[];
}

export const Map = ({ center, zoom, lat, lng, markers }: MapProps) => {
	const mapRef = useRef(null);
	const [mapReady, setMapReady] = useState(false);

	return (
		<div style={{ height: '75vh', width: '75vw' }}>
			<GoogleMap
				bootstrapURLKeys={{ key: '' }}
				defaultCenter={center}
				defaultZoom={zoom}
				//@ts-ignore
				onGoogleApiLoaded={({ map }) => {
					mapRef.current = map;
					setMapReady(true);
				}}
			>
				<Marker lat={lat} lng={lng} markerId='You are here' />
				{markers.map((marker, index) => (
					<Marker key={index} lat={marker.lat} lng={marker.lng} markerId={index.toString()} />
				))}
			</GoogleMap>
		</div>
	);
};
