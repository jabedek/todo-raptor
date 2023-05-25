import { useEffect, useState } from "react";

import { InputProps, InputWritten, SelectOption } from "@@components/forms";
import { InputChangeEvent, WrittenChangeEvent } from "./types";

type RadioOption<T> = SelectOption<T> & {
  default?: boolean;
  notselectable?: boolean;
};

type Props = Omit<InputProps, "value"> & {
  options: RadioOption<unknown>[];
  orientation?: "horizontal" | "vertical";
};

const InputRadios: React.FC<Props> = (props) => {
  const [valueWritten, setValueWritten] = useState("");
  const [selectedWrite, setSelectedWrite] = useState(false);
  const [checkedID, setCheckedID] = useState("");

  useEffect(() => {
    const checkedValueIndex = props.options.findIndex((v) => v.default === true);
    if (checkedValueIndex > -1) {
      const checkedOption = props.options[checkedValueIndex];
      props.changeFn(checkedOption?.value);
      const id = `${checkedValueIndex}-${checkedOption?.value as string}`;
      setCheckedID(id);
      if (checkedOption.customWrite) {
        setSelectedWrite(true);
      }
    }
  }, [props.options[0].label, props.options[0].value]);

  const updateValueRadio = (e: React.ChangeEvent<HTMLInputElement>, option: RadioOption<unknown>): void => {
    const val = e.currentTarget.value;
    const id = e.currentTarget.id;
    if (!option.notselectable) {
      setCheckedID(id);
      if (option.customWrite === true) {
        setSelectedWrite(true);
        if (valueWritten.length > 0) {
          props.changeFn(option?.prefix + valueWritten);
        }
      } else {
        setSelectedWrite(false);
        props.changeFn(val);
      }
    }
  };

  const updateValueWritten = (e: WrittenChangeEvent, prefix = ""): void => {
    const value = e.currentTarget.value;
    setValueWritten(value);
    props.changeFn(prefix + value);
  };

  return (
    <div className={`relative pt-[20px] w-full`}>
      <h1 className={` pb-2 app_radios_title `}>
        {props.label && (
          <>
            {props.label}
            {props.required ? " *" : ""}
          </>
        )}
      </h1>
      <div className={` w-full ${props.orientation === "horizontal" ? "flex gap-5" : ""}`}>
        {props.options?.map((o, i) => {
          const value = "" + o.value;
          const optionId = `${i}-${value}`;

          return (
            <div
              key={optionId}
              className={`my-1 flex flex-col items-center justify-start h-10 w-[90%]`}>
              <input
                tabIndex={0}
                id={optionId}
                type="radio"
                name={props.name}
                checked={checkedID === optionId}
                value={value || "[not defined]"}
                onChange={(e: InputChangeEvent) => updateValueRadio(e, o)}
                className={`app_input_radio peer`}
                required={props.required}
                disabled={props.disabled || o.notselectable || (!o.customWrite && !value)}
              />

              <label
                htmlFor={optionId}
                className={` app_input_label_radio min-w-[100px] Xtext-ellipsis Xoverflow-hidden Xwhitespace-nowrap 
                ${props.required ? "after:pl-1" : ""}`}>
                {o.label}
              </label>

              {o.customWrite && (
                <div className={` ml-2 w-[65%]`}>
                  <InputWritten
                    disabled={!selectedWrite}
                    type="text"
                    name={props.name}
                    value={valueWritten}
                    tailwindStyles="w-full"
                    label=""
                    changeFn={(e: WrittenChangeEvent) => updateValueWritten(e, o.prefix)}
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
