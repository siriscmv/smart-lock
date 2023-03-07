import Link from 'next/link';

interface ButtonProps {
	text: string;
	run?: () => unknown;
	href?: string;
}

const Button = (props: ButtonProps) => {
	const btn = (
		<button
			onClick={props.run}
			className='text-center text-xl font-bold text-slate hover:-translate-y-1 transition-all duration-150 ease-in-out rounded-md bg-primary m-2 p-3 hover:bg-primary/60'
		>
			{props.text}
		</button>
	);

	if (props.href) return <Link href={props.href}>{btn}</Link>;
	else return btn;
};

export default Button;
