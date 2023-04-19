import { createInputId } from "frotsi";
import { useState, useEffect, useMemo, useRef } from "react";
import { InputRadiosProps, RadioOption } from "./../types";
import InputWritten from "./InputWritten";

const InputRadios: React.FC<InputRadiosProps> = (props) => {
  const [focus, setfocus] = useState(false);
  const [valueWritten, setValueWritten] = useState("");
  const [selectedWrite, setSelectedWrite] = useState(false);
  const [checkedID, setCheckedID] = useState("");
  const inputId = useRef(createInputId(props.name, "radio")).current;

  useEffect(() => {
    const checkedValueIndex = props.radioOptions.findIndex((v, i) => v.default === true);
    if (checkedValueIndex > -1) {
      const checkedOption = props.radioOptions[checkedValueIndex];
      props.onChange(checkedOption?.value);
      const id = `${checkedValueIndex}-${checkedOption?.value}`;
      setCheckedID(id);
      if (checkedOption.customWrite) {
        setSelectedWrite(true);
      }
    }
  }, [props.radioOptions[0].label, props.radioOptions[0].value]);

  const updateValueRadio = (e: React.ChangeEvent<HTMLInputElement>, option: RadioOption<any>) => {
    const val = e.currentTarget.value;
    const id = e.currentTarget.id;

    setCheckedID(id);
    if (option.customWrite === true) {
      setSelectedWrite(true);
      if (valueWritten.length > 0) {
        props.onChange(valueWritten);
      }
    } else {
      setSelectedWrite(false);
      props.onChange(val);
    }
  };

  const updateValueWritten = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setValueWritten(value);
    props.onChange(value);
  };

  return (
    <div className={`${inputId} relative pt-[20px] w-full`}>
      <h1 className={` pb-2 app_radios_title `}>
        {props.label && (
          <>
            {props.label}
            {props.required ? " *" : ""}
          </>
        )}
      </h1>
      <div
        className={` w-full ${props.orientation === "horizontal" ? "flex gap-5" : ""}`}
        onFocus={() => setfocus(true)}
        onBlur={() => setfocus(false)}>
        {props.radioOptions?.map((o, i) => {
          const optionId = `${i}-${o.value}`;

          return (
            <div
              key={optionId}
              className={`${optionId} my-1 flex items-center justify-start h-10 w-[90%]`}>
              <input
                tabIndex={0}
                id={optionId}
                type="radio"
                name={props.name}
                checked={checkedID === optionId}
                value={o.value || "[not defined]"}
                onChange={(e) => updateValueRadio(e, o)}
                className={`${optionId} app_input_radio peer`}
                required={props.required}
                disabled={props.disabled || (!o.customWrite && !o.value)}
              />

              <label
                htmlFor={optionId}
                className={`${optionId} app_input_label_radio min-w-[100px] Xtext-ellipsis Xoverflow-hidden Xwhitespace-nowrap 
                ${props.required ? "after:pl-1" : ""}`}>
                {o.label}
              </label>

              {o.customWrite && (
                <div className={`${optionId} ml-2 w-[65%]`}>
                  <InputWritten
                    disabled={!selectedWrite}
                    type="text"
                    name={props.name}
                    value={valueWritten}
                    label=""
                    onChange={updateValueWritten}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InputRadios;
