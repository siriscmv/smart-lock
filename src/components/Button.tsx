interface ButtonProps {
	text: string;
	run?: () => unknown;
}

const Button = (props: ButtonProps) => {
	return (
		<button
			onClick={props.run}
			className='text-center hover:-translate-y-1 rounded-sm bg-primary m-2 p-3 font-semibold text-lg hover:bg-primary/60'
		>
			{props.text}
		</button>
	);
};

export default Button;
