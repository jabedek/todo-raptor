import { CallbackFn } from "frotsi";
import { useLayoutEffect, useState } from "react";

type Props = React.HTMLProps<HTMLButtonElement> & {
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

export const Button: React.FC<Props> = ({ label, clickFn, href, disabled, children, formStyle, tailwindStyles }) => {
  const currentStyle = formStyle === "primary" ? primaryStyle : secondaryStyle;
  const [style, setStyle] = useState(currentStyle);

  const handleClick = (e?: React.FormEvent<HTMLButtonElement>): void => {
    e?.preventDefault();

    if (clickFn) {
      clickFn();
    } else if (href) {
      window.location.href = href;
    }
  };

  useLayoutEffect(() => {
    let styleChange = "";

    if (formStyle) {
      styleChange = `${basicFormButtonStyle} `;
    }

    if (disabled === true) {
      styleChange += disabledStyle;
    }

    if (!disabled) {
      styleChange += currentStyle;
    }

    setStyle(styleChange);
  }, [disabled]);

  return (
    <button
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onClick={handleClick}
      className={`relative  ${style}  ${tailwindStyles}`}>
      <span className={`app_flex_center`}>{children ? children : label}</span>
    </button>
  );
};
