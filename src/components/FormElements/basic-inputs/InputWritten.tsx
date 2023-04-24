import { createInputId } from "frotsi";
import { InputWrittenProps } from "./../types";
import { useEffect, useRef, useState } from "react";

const InputWritten: React.FC<InputWrittenProps> = (props, ref) => {
  const [value, setvalue] = useState(props.value || "");
  const [focus, setfocus] = useState(false);
  const inputId = useRef(createInputId(props.name, props.type)).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();

    const newValue = e.target.value;
    setvalue(newValue);
    props.changeFn(newValue);

    if (props.changeSideEffectFn) {
      props.changeSideEffectFn(inputId, e);
    }
  };

  return (
    <div
      className={`${inputId} relative mt-4 my-1 min-h-[40px] h-[40px] w-full ${
        props.label && props.label.length > 0 && "app_input_top"
      }`}
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
          value={value}
          onChange={(e) => handleChange(e)}
          minLength={props.inputTypeSpecs?.minLength}
          maxLength={props.inputTypeSpecs?.maxLength}
          className={`${inputId} app_input peer bg-transparent`}
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
          className={`${inputId} app_input peer bg-transparent min-h-[70px] h-[70px] text-[14px] `}
          placeholder=" "
          required={props.required}
          disabled={props.disabled}
        />
      )}
      {props.label && props.label.length > 0 && (
        <label
          htmlFor={inputId}
          className={`${inputId} app_input_label  whitespace-nowrap ${props.required ? "after:pl-1" : ""}`}>
          {props.label}
        </label>
      )}

      {props.inputTypeSpecs && (
        <div className={`${inputId} app_input_info`}>
          <span>{length}</span>
        </div>
      )}

      {props.hint && focus && (
        <p
          className={`${inputId} absolute top-[105%] hidden text-[11px] text-gray-900 bg-gray-200 shadow-lg py-1 px-3 rounded-sm h-[40px] min-w-[200px] leading-[14px] peer-hover:flex peer-hover:z-20`}>
          {props.hint}
        </p>
      )}
    </div>
  );
};

export default InputWritten;
