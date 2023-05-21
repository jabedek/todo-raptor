import { generateInputId } from "frotsi";
import { useState, useEffect, useRef } from "react";

import { InputProps, InputWritten, SelectOption } from "@@components/forms";
import { Flatten } from "@@types";

type CheckboxOption = Flatten<
  SelectOption<any> & {
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
  const [focus, setfocus] = useState(false);
  const [values, setvalues] = useState<CheckboxOption[]>([]);
  // const [values, setvalues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // const newValues: Record<string, any> = {};
    // props.options.forEach((option) => {
    //   const key = `${option.value}`;
    //   newValues[key] = option.checked;
    // });

    // setvalues(newValues);

    setvalues(props.options);

    const checkedValueIndex = props.options.findIndex((v, i) => v.value === true);

    if (checkedValueIndex > -1) {
      const checkedOption = props.options[checkedValueIndex];
      props.changeFn(checkedOption?.value);
    }
  }, [props]);

  const updateValue = (option: CheckboxOption) => {
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
      <div
        className={` w-full ${props.orientation === "horizontal" ? "flex gap-5" : ""}`}
        onFocus={() => setfocus(true)}
        onBlur={() => setfocus(false)}>
        {values?.map((o, i) => {
          const optionId = `${i}-${o.value}`;

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
                value={o.value || "[not defined]"}
                onChange={() => updateValue(o)}
                className={`app_input_checkbox peer`}
                required={props.required}
                disabled={props.disabled || o.notselectable || (!o.customWrite && !o.value)}
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
