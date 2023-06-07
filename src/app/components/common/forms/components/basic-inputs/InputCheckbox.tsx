import { Flatten } from "frotsi";
import { useEffect, useState } from "react";

import { InputProps, SelectOption } from "@@components/common";

type CheckboxOption = Flatten<
  SelectOption<unknown> & {
    default?: boolean;
    notselectable?: boolean;
    checked: boolean;
  }
>;

type Props = Flatten<
  Omit<InputProps, "value"> & {
    options: CheckboxOption[];
    orientation?: "horizontal" | "vertical";
  }
>;

export const InputCheckbox: React.FC<Props> = ({ options, changeFn, label, orientation, name, required, disabled }) => {
  const [values, setvalues] = useState<CheckboxOption[]>([]);

  useEffect(() => {
    setvalues(options);

    const checkedValueIndex = options.findIndex((v) => v.value === true);

    if (checkedValueIndex > -1) {
      const checkedOption = options[checkedValueIndex];
      changeFn(checkedOption?.value);
    }
  }, [options]);

  const updateValue = (option: CheckboxOption): void => {
    const newOptions = [...values];
    newOptions.forEach((op) => {
      if (op.value === option.value) {
        op.checked = !op.checked;
      }
    });

    setvalues(newOptions);
    changeFn(newOptions);
  };

  return (
    <div className={`relative pt-[20px] w-full`}>
      <h1 className={` pb-2 app_input_checkbox_title `}>
        {label && (
          <>
            {label}
            {required ? " *" : ""}
          </>
        )}
      </h1>
      <div className={` w-full ${orientation === "horizontal" ? "flex gap-5" : ""}`}>
        {values?.map((o, i) => {
          const value = "" + o.value;
          const optionId = `${i}-${value}`;

          return (
            <div
              key={optionId}
              className={`my-1 flex  items-center justify-start h-10 w-[90%]`}>
              <input
                tabIndex={0}
                id={optionId}
                type="checkbox"
                name={name}
                checked={o.checked}
                value={value || "[not defined]"}
                onChange={() => updateValue(o)}
                className={`app_input_checkbox peer`}
                required={required}
                disabled={disabled || o.notselectable || (!o.customWrite && !value)}
              />

              <label
                htmlFor={optionId}
                className={` app_input_label_option_checkbox min-w-[100px] Xtext-ellipsis Xoverflow-hidden Xwhitespace-nowrap 
                ${required ? "after:pl-1" : ""}`}>
                {o.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
