import { generateInputId } from "frotsi";
import { useRef, useState } from "react";
import { InputProps, InputSpecifics, InputWrittenType, WrittenChangeEvent } from "@@components/forms";

type Props = Omit<InputProps, "changeFn" | "value"> & {
  type: InputWrittenType;
  inputTypeSpecs?: InputSpecifics;
  pattern?: string;
  focus?: boolean;
  hint?: string;
  autoComplete?: string;
  invalid?: boolean;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeFn: (event: WrittenChangeEvent, val: string) => void;
};

export const InputWritten: React.FC<Props> = ({
  name,
  type,
  changeFn,
  changeSideEffectFn,
  value,
  pattern,
  required,
  disabled,
  invalid,
  tailwindStyles,
  hint,
  inputTypeSpecs,
  autoComplete,
  label,
}) => {
  const [focus, setfocus] = useState(false);
  const inputId = useRef(generateInputId(name, type)).current;

  const handleChange = (e: WrittenChangeEvent): void => {
    e.preventDefault();
    const newValue = e.target.value;
    changeFn(e, newValue);
    if (changeSideEffectFn) {
      changeSideEffectFn(inputId, e);
    }
  };

  return (
    <div
      className={`app_flex_center  relative mb-8 app_input_top h-fit min-h-[40px] min-w-[150px] w-[fit-content] ${tailwindStyles}`}
      onFocus={() => setfocus(true)}
      onBlur={() => setfocus(false)}>
      {/* {invalid ? "invalid" : "valid"} */}
      {type !== "textarea" && (
        <input
          tabIndex={0}
          autoFocus={!!focus}
          autoComplete={autoComplete || `new-password`}
          id={inputId}
          type={type}
          name={name}
          value={"" || value}
          onChange={(e) => handleChange(e)}
          minLength={inputTypeSpecs?.minLength}
          maxLength={inputTypeSpecs?.maxLength}
          className={`app_input peer bg-transparent w-full ${invalid ? "app_input_invalid" : ""}`}
          placeholder=" "
          required={required}
          pattern={pattern}
          disabled={disabled}
        />
      )}
      {type === "textarea" && (
        <textarea
          tabIndex={0}
          autoFocus={!!focus}
          autoComplete={autoComplete || `new-password`}
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => handleChange(e)}
          minLength={inputTypeSpecs?.minLength}
          maxLength={inputTypeSpecs?.maxLength}
          className={`app_input peer bg-transparent min-h-[35px] h-[35px] text-[14px] w-full `}
          placeholder=" "
          required={required}
          disabled={disabled}
        />
      )}
      <label
        htmlFor={inputId}
        className={`app_input_label  whitespace-nowrap ${required ? "after:pl-1" : ""}`}>
        {label || ""}
      </label>

      {inputTypeSpecs && (
        <div className={`app_input_info`}>
          <span>{length}</span>
        </div>
      )}

      {hint && focus && (
        <p
          className={`absolute top-[105%] hidden text-[11px] text-gray-900 bg-gray-200 shadow-lg py-1 px-3 rounded-sm h-[40px] min-w-[200px] leading-[14px] peer-hover:flex peer-hover:z-20`}>
          {hint}
        </p>
      )}
    </div>
  );
};
