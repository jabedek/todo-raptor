import { createInputId } from "frotsi";
import { InputSelectProps } from "./types";
import { useState } from "react";

const InputSelect: React.FC<InputSelectProps> = (props) => {
  const [focus, setfocus] = useState(false);
  const inputId = createInputId(props.name, "select");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget?.value;
    props.onChange(value);
  };

  return (
    <div
      className={`${inputId} sticky  mt-4 my-1 app_input_top`}
      onFocus={() => setfocus(true)}
      onBlur={() => setfocus(false)}>
      <select
        autoFocus={!!props.focus}
        autoCorrect="off"
        id={inputId}
        name={props.name}
        value={props.value}
        onChange={handleChange}
        className={`${inputId}  app_input peer bg-transparent`}
        placeholder=" "
        required={props.required}
        disabled={props.disabled}>
        <>
          <option
            tabIndex={0}
            key="-100"
            value={"Wybierz"}
            className={`${inputId}  bg-app_light`}>
            Wybierz
          </option>
          {props.selectOptions?.map((option, i) => (
            <option
              key={i}
              value={option.value}
              className={`${inputId}  bg-app_light`}>
              {option.label}
            </option>
          ))}
        </>
      </select>
      <label
        htmlFor={inputId}
        className={`${inputId} app_input_label ${props.required ? "after:pl-1" : ""}`}>
        {props.label}
      </label>
    </div>
  );
};

export default InputSelect;
