import { createInputId } from "frotsi";
import { InputWrittenProps } from "./types";
import { useEffect, useState } from "react";

const InputWritten: React.FC<InputWrittenProps> = (props, ref) => {
  const [length, setLength] = useState<string>("");
  const [focus, setfocus] = useState(false);
  const inputId = createInputId(props.name, props.type);

  useEffect(() => {
    setLength(getLength(props.value));
  }, [props.value]);

  const getLength = (val: string | number) => {
    const minLen = props.inputTypeSpecs?.minLength || 0;
    const maxLen = props.inputTypeSpecs?.maxLength || 0;
    const currentLen = String(val).length;

    let result = `[${minLen < 10 ? "0" : ""}${minLen}`;
    if (minLen !== maxLen) {
      result += `${maxLen < 10 ? " - 0" : " - "}${maxLen}]`;
    } else {
      result += "]";
    }

    if (minLen > 0 && maxLen === 0) {
      result = `[min. ${minLen < 10 ? "0" : ""}${minLen}]`;
    }

    if (maxLen > 0 && minLen === 0) {
      result = `[max. ${minLen < 10 ? "0" : ""}${minLen}]`;
    }

    result += ` (${currentLen < 10 ? "0" : ""}${currentLen})`;

    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.onChange(e);

    if (props.onChangeSideEffect) {
      props.onChangeSideEffect(inputId, e);
    }
  };

  return (
    <div
      className={`${inputId} sticky mt-4 my-1 w-full ${props.label.length > 0 && "app_input_top"}`}
      onFocus={() => setfocus(true)}
      onBlur={() => setfocus(false)}>
      <input
        tabIndex={0}
        autoFocus={!!props.focus}
        autoCorrect="new-password"
        id={inputId}
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={(e) => handleChange(e)}
        minLength={props.inputTypeSpecs?.minLength}
        maxLength={props.inputTypeSpecs?.maxLength}
        className={`${inputId} app_input peer bg-transparent`}
        placeholder=" "
        required={props.required}
        pattern={props.pattern}
        disabled={props.disabled}
      />
      {props.label.length > 0 && (
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
