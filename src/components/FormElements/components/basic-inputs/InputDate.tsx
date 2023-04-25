import { useState, useRef } from "react";
import { generateInputId } from "frotsi";

import { BasicInputsTypes } from "@@components/FormElements";

const InputDate: React.FC<BasicInputsTypes.InputDateProps> = (props) => {
  const [focus, setfocus] = useState(false);
  const inputId = useRef(generateInputId(props.name, props.type || "date")).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value; // YYYY-MM-DD

    props.changeFn(value);
  };

  return (
    <div
      className={`${inputId} sticky mt-4 my-1 w-full ${props.label && props.label.length > 0 && "app_input_top"}`}
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
      {props.label && props.label.length > 0 && (
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
