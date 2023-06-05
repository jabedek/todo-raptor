import { useRef } from "react";
import { generateInputId } from "frotsi";
import { InputDateTimeType, InputProps, InputSpecifics } from "@@components/forms";

type Props = InputProps & {
  type: InputDateTimeType;
  inputTypeSpecs?: InputSpecifics;
  focus?: boolean;
};

export const InputDate: React.FC<Props> = ({
  name,
  type,
  changeFn,
  changeSideEffectFn,
  value,
  required,
  disabled,
  inputTypeSpecs,
  label,
  focus,
}) => {
  const inputId = useRef(generateInputId(name, type || "date")).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.currentTarget.value; // YYYY-MM-DD
    changeFn(value);
  };

  return (
    <div className={`${inputId} sticky mt-4 my-1 w-full ${label && label.length > 0 && "app_input_top"}`}>
      <input
        tabIndex={0}
        autoFocus={!!focus}
        autoCorrect="new-password"
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className={`${inputId} app_input peer bg-transparent`}
        placeholder=" "
        min={inputTypeSpecs?.minTime || "09:00"}
        max={inputTypeSpecs?.maxTime || "17:00"}
        required={required}
        disabled={disabled}
      />
      {label && label.length > 0 && (
        <label
          htmlFor={inputId}
          className={`${inputId} app_input_label ${required ? "after:pl-1" : ""}`}>
          {label}
        </label>
      )}
    </div>
  );
};
