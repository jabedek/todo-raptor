import { CallbackFn } from "frotsi";
import { useLayoutEffect, useState } from "react";

type Props = {
  label?: string;
  clickFn?: CallbackFn<void>;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  formStyle?: "primary" | "secondary";
  tailwindStyles?: string;
};

const primaryStyle = "bg-app_primary text-white border-app_primary ";
const secondaryStyle = "bg-white-100 transition-all duration-200 hover:bg-white-200 text-black ";

const disabledStyle = "bg-gray-100 text-gray-400 border-gray-600";
const basicFormButtonStyle =
  "my-2 app_form_button active:shadow-app_form_button_active focus:shadow-app_form_button_focus text-[14px] font-[500] ";

const Button: React.FC<Props> = (props) => {
  const currentStyle = props.formStyle === "primary" ? primaryStyle : secondaryStyle;
  const [style, setStyle] = useState(currentStyle);

  const handleClick = (e?: React.FormEvent<HTMLButtonElement>): void => {
    e?.preventDefault();

    if (props?.clickFn) {
      props.clickFn();
    } else if (props?.href) {
      window.location.href = props.href;
    }
  };

  useLayoutEffect(() => {
    let styleChange = "";

    if (props.formStyle) {
      styleChange = `${basicFormButtonStyle} `;
    }

    if (props.disabled === true) {
      styleChange += disabledStyle;
    }

    if (!props.disabled) {
      styleChange += currentStyle;
    }

    setStyle(styleChange);
  }, [props.disabled]);

  return (
    <button
      tabIndex={props.disabled ? -1 : 0}
      disabled={props.disabled}
      onClick={handleClick}
      className={`relative  ${style}  ${props.tailwindStyles}`}>
      <span className={`app_flex_center`}>{props.children ? props.children : props.label}</span>
    </button>
  );
};

export default Button;
