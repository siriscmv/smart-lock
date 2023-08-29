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
	markerId: string;
	draggable?: boolean;
	src?: string;
	onClick?: (
		event: ReactMouseEvent<HTMLImageElement, MouseEvent>,
		data: { markerId: string; lat: number; lng: number }
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
			style={{ cursor: 'pointer', fontSize: 40 }}
			alt={markerId}
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
