import { InputProps, InputSpecifics, InputWrittenType } from "@@components/forms";
import { generateInputId } from "frotsi";
import { useRef, useState } from "react";

type Props = InputProps & {
  type: InputWrittenType;
  inputTypeSpecs?: InputSpecifics;
  pattern?: string;
  focus?: boolean;
  hint?: string;
  autoComplete?: string;
};

const InputWritten: React.FC<Props> = (props) => {
  const [focus, setfocus] = useState(false);
  const inputId = useRef(generateInputId(props.name, props.type)).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();

    const newValue = e.target.value;
    props.changeFn(newValue);

    if (props.changeSideEffectFn) {
      props.changeSideEffectFn(inputId, e);
    }
  };

  return (
    <div
      className={`app_flex_center  relative mb-8 app_input_top h-fit min-h-[40px] min-w-[150px] w-[fit-content] ${props.tailwindStyles}`}
      onFocus={() => setfocus(true)}
      onBlur={() => setfocus(false)}>
      {props.type !== "textarea" && (
        <input
          tabIndex={0}
          autoFocus={!!props.focus}
          autoComplete={props.autoComplete || `new-password`}
          id={inputId}
          type={props.type}
          name={props.name}
          value={"" || props.value}
          onChange={(e) => handleChange(e)}
          minLength={props.inputTypeSpecs?.minLength}
          maxLength={props.inputTypeSpecs?.maxLength}
          className={`app_input peer bg-transparent w-full`}
          placeholder=" "
          required={props.required}
          pattern={props.pattern}
          disabled={props.disabled}
        />
      )}
      {props.type === "textarea" && (
        <textarea
          tabIndex={0}
          autoFocus={!!props.focus}
          autoComplete={props.autoComplete || `new-password`}
          id={inputId}
          name={props.name}
          value={props.value}
          onChange={(e) => handleChange(e)}
          minLength={props.inputTypeSpecs?.minLength}
          maxLength={props.inputTypeSpecs?.maxLength}
          className={`app_input peer bg-transparent min-h-[35px] h-[35px] text-[14px] w-full `}
          placeholder=" "
          required={props.required}
          disabled={props.disabled}
        />
      )}
      <label
        htmlFor={inputId}
        className={`app_input_label  whitespace-nowrap ${props.required ? "after:pl-1" : ""}`}>
        {props.label || ""}
      </label>

      {props.inputTypeSpecs && (
        <div className={`app_input_info`}>
          <span>{length}</span>
        </div>
      )}

      {props.hint && focus && (
        <p
          className={`absolute top-[105%] hidden text-[11px] text-gray-900 bg-gray-200 shadow-lg py-1 px-3 rounded-sm h-[40px] min-w-[200px] leading-[14px] peer-hover:flex peer-hover:z-20`}>
          {props.hint}
        </p>
      )}
    </div>
  );
};

export default InputWritten;
