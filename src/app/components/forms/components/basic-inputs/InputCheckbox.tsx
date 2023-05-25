import { Flatten } from "frotsi";
import { useEffect, useState } from "react";

import { InputProps, SelectOption } from "@@components/forms";

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

const InputCheckbox: React.FC<Props> = (props) => {
  const [values, setvalues] = useState<CheckboxOption[]>([]);

  useEffect(() => {
    setvalues(props.options);

    const checkedValueIndex = props.options.findIndex((v) => v.value === true);

    if (checkedValueIndex > -1) {
      const checkedOption = props.options[checkedValueIndex];
      props.changeFn(checkedOption?.value);
    }
  }, [props]);

  const updateValue = (option: CheckboxOption): void => {
    const newOptions = [...values];
    newOptions.forEach((op) => {
      if (op.value === option.value) {
        op.checked = !op.checked;
      }
    });

    setvalues(newOptions);
    props.changeFn(newOptions);
  };

  return (
    <div className={`relative pt-[20px] w-full`}>
      <h1 className={` pb-2 app_input_checkbox_title `}>
        {props.label && (
          <>
            {props.label}
            {props.required ? " *" : ""}
          </>
        )}
      </h1>
      <div className={` w-full ${props.orientation === "horizontal" ? "flex gap-5" : ""}`}>
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
                name={props.name}
                checked={o.checked}
                value={value || "[not defined]"}
                onChange={() => updateValue(o)}
                className={`app_input_checkbox peer`}
                required={props.required}
                disabled={props.disabled || o.notselectable || (!o.customWrite && !value)}
              />

              <label
                htmlFor={optionId}
                className={` app_input_label_option_checkbox min-w-[100px] Xtext-ellipsis Xoverflow-hidden Xwhitespace-nowrap 
                ${props.required ? "after:pl-1" : ""}`}>
                {o.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InputCheckbox;
