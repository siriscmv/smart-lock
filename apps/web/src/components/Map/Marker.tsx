import { func, number, oneOfType, string } from 'prop-types';
import { MouseEvent as ReactMouseEvent } from 'react';

const Marker = ({
	className,
	lat,
	lng,
	markerId,
	onClick,
	draggable,
	src,
	...props
}: {
	className?: string;
	lat: number;
	lng: number;
	markerId: number;
	draggable?: boolean;
	src?: string;
	onClick?: (
		event: ReactMouseEvent<HTMLImageElement, MouseEvent>,
		data: { markerId: number; lat: number; lng: number }
	) => unknown;
}) => {
	return (
		<img
			draggable={draggable}
			className={className}
			src={src ?? '/marker-pin.png'}
			//@ts-ignore
			lat={lat}
			lng={lng}
			onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
			//@ts-ignore
			onDragEnd={(_, { latLng }) => {
				if (!draggable) return;
				const lat = latLng.lat();
				const lng = latLng.lng();

				window.ws!.send(
					JSON.stringify({
						op: 'ADD_STOP',
						auth: window.auth,
						data: { location: { lat, lng, id: markerId } }
					})
				);
			}}
			style={{ cursor: 'pointer', fontSize: 40 }}
			alt={markerId.toString()}
			{...props}
		/>
	);
};

Marker.defaultProps = {};

Marker.propTypes = {
	className: string,
	/**
	 * The id of the marker.
	 */
	markerId: oneOfType([number, string]).isRequired,
	/**
	 * The latitude of the marker.
	 */
	lat: number.isRequired,
	/**
	 * The longitude of the marker.
	 */
	lng: number.isRequired,
	/**
	 * The function to call when the marker is clicked.
	 */
	onClick: func
};

export default Marker;
