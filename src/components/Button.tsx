interface ButtonProps {
    text: string;
    run?: () => unknown;
}

const Button = (props: ButtonProps) => {
    return (
        <div onClick={props.run} className="text-center rounded-sm bg-primary m-2 p-3 font-semibold text-lg hover:bg-primary/60">
            {props.text}
        </div>
    )
}

export default Button;