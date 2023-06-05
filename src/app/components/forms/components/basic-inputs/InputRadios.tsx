import { useEffect, useState } from "react";

import { InputProps, InputWritten, SelectOption, InputChangeEvent, WrittenChangeEvent } from "@@components/forms";

type RadioOption<T> = SelectOption<T> & {
  default?: boolean;
  notselectable?: boolean;
};

type Props = Omit<InputProps, "value"> & {
  options: RadioOption<unknown>[];
  orientation?: "horizontal" | "vertical";
};

export const InputRadios: React.FC<Props> = ({ options, changeFn, label, orientation, name, required, disabled }) => {
  const [valueWritten, setValueWritten] = useState("");
  const [selectedWrite, setSelectedWrite] = useState(false);
  const [checkedID, setCheckedID] = useState("");

  useEffect(() => {
    const checkedValueIndex = options.findIndex((v) => v.default === true);
    if (checkedValueIndex > -1) {
      const checkedOption = options[checkedValueIndex];
      changeFn(checkedOption?.value);
      const id = `${checkedValueIndex}-${checkedOption?.value as string}`;
      setCheckedID(id);
      if (checkedOption.customWrite) {
        setSelectedWrite(true);
      }
    }
  }, [options[0].label, options[0].value]);

  const updateValueRadio = (e: React.ChangeEvent<HTMLInputElement>, option: RadioOption<unknown>): void => {
    const val = e.currentTarget.value;
    const id = e.currentTarget.id;
    if (!option.notselectable) {
      setCheckedID(id);
      if (option.customWrite === true) {
        setSelectedWrite(true);
        if (valueWritten.length > 0) {
          changeFn(option?.prefix + valueWritten);
        }
      } else {
        setSelectedWrite(false);
        changeFn(val);
      }
    }
  };

  const updateValueWritten = (e: WrittenChangeEvent, prefix = ""): void => {
    const value = e.currentTarget.value;
    setValueWritten(value);
    changeFn(prefix + value);
  };

  return (
    <div className={`relative pt-[20px] w-full`}>
      <h1 className={` pb-2 app_radios_title `}>
        {label && (
          <>
            {label}
            {required ? " *" : ""}
          </>
        )}
      </h1>
      <div className={` w-full ${orientation === "horizontal" ? "flex gap-5" : ""}`}>
        {options?.map((o, i) => {
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
                name={name}
                checked={checkedID === optionId}
                value={value || "[not defined]"}
                onChange={(e: InputChangeEvent) => updateValueRadio(e, o)}
                className={`app_input_radio peer`}
                required={required}
                disabled={disabled || o.notselectable || (!o.customWrite && !value)}
              />

              <label
                htmlFor={optionId}
                className={` app_input_label_radio min-w-[100px] Xtext-ellipsis Xoverflow-hidden Xwhitespace-nowrap 
                ${required ? "after:pl-1" : ""}`}>
                {o.label}
              </label>

              {o.customWrite && (
                <div className={` ml-2 w-[65%]`}>
                  <InputWritten
                    disabled={!selectedWrite}
                    type="text"
                    name={name}
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
