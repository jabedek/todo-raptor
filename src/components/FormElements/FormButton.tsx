import { CallbackFn } from "frotsi";
import { useEffect, useState } from "react";

type FormButtonProps = {
  style: "primary" | "secondary";
  label?: string;
  action?: CallbackFn<void>;
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  tailwindStyles?: string;
};

const primaryStyle = "bg-app_primary text-white border-app_primary ";
const secondaryStyle = "bg-white-100 text-app_secondary XXborder-app_secondary";
const disabledStyle = "bg-gray-100 text-gray-400 border-gray-600";

const FormButton: React.FC<FormButtonProps> = (props) => {
  const currentStyle = props.style === "primary" ? primaryStyle : secondaryStyle;
  const [style, styStyle] = useState(currentStyle);

  const handleClick = (e?: React.FormEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (props?.action) {
      props.action();
    } else if (props?.href) {
      window.location.href = props.href;
    }
  };

  useEffect(() => {
    if (props.disabled === true) {
      styStyle(disabledStyle);
    }

    if (!props.disabled) {
      styStyle(currentStyle);
    }
  }, [props.disabled]);

  return (
    <button
      tabIndex={props.disabled ? -1 : 0}
      disabled={props.disabled}
      onClick={handleClick}
      className={`my-2  app_form_button active:shadow-app_form_button_active focus:shadow-app_form_button_focus text-[14px] ${style}  ${props.tailwindStyles}`}>
      <span className={`app_flex_center`}>{props.children ? props.children : props.label}</span>
    </button>
  );
};

export default FormButton;
