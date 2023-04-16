import React, { useState } from "react";
import { InputDateProps } from "./types";
import { createInputId } from "frotsi";

const InputDate: React.FC<InputDateProps> = (props) => {
  const [focus, setfocus] = useState(false);
  const inputId = createInputId(props.name, props.type || "date");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value; // YYYY-MM-DD

    props.onChange(value);
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
        onChange={handleChange}
        className={`${inputId} app_input peer bg-transparent`}
        placeholder=" "
        min={props.inputTypeSpecs?.minTime || "09:00"}
        max={props.inputTypeSpecs?.maxTime || "17:00"}
        required={props.required}
        disabled={props.disabled}
      />
      {props.label.length > 0 && (
        <label
          htmlFor={inputId}
          className={`${inputId} app_input_label ${props.required ? "after:pl-1" : ""}`}>
          {props.label}
        </label>
      )}
    </div>
  );
};

export default InputDate;
