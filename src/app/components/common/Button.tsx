import { CallbackFn } from "frotsi";

type ButtonProps = {
  label?: string;
  clickFn?: CallbackFn<void>;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  tailwindStyles?: string;
};

const Button: React.FC<ButtonProps> = (props) => {
  const handleClick = (e?: React.FormEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (props?.clickFn) {
      props.clickFn();
    } else if (props?.href) {
      window.location.href = props.href;
    }
  };

  return (
    <button
      tabIndex={0}
      disabled={props.disabled}
      onClick={handleClick}
      className={`relative    ${props.tailwindStyles}`}>
      <span className={`app_flex_center`}>{props.children ? props.children : props.label}</span>
    </button>
  );
};

export default Button;
