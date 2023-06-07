import { generateInputId } from "frotsi";
import { useEffect, useRef, useState } from "react";

import { useHandleOutclick } from "@@hooks";
import { InputProps, InputSpecifics, InputWritten, SelectOption, WrittenChangeEvent } from "@@components/common";
import { Icons } from "@@components/Layout";

type Props<T extends unknown = unknown> = Omit<InputProps<T>, "changeFn"> & {
  inputTypeSpecs?: InputSpecifics;
  options: SelectOption<T>[];
  focus?: boolean;
  selectWidth?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeFn: (val, ...args: any) => void;
};

export const InputSelect: React.FC<Props> = ({
  name,
  options,
  value,
  disabled,
  changeFn,
  label,
  required,
  tailwindStyles,
  focus,
  selectWidth,
}) => {
  type Option = (typeof options)[0];
  const [focused, setfocused] = useState(false);
  const [isOpened, setisOpened] = useState(false);
  const [currentOption, setcurrentOption] = useState<Option>();
  const inputId = useRef(generateInputId(name, "select")).current;
  const refEl = useRef<HTMLDivElement>(null);
  const [customSelected, setcustomSelected] = useState(false);
  const [customValue, setcustomValue] = useState("");
  const [prefix, setprefix] = useState("");

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        const index = (e.target as HTMLDivElement).dataset["index"] || -1;
        const option: Option = options[index];
        if (option) {
          updateValue(option);
        }

        if (!isOpened) {
          setisOpened(true);
        }
      }
    };

    refEl.current?.addEventListener("keydown", handleEnter);

    return () => refEl.current?.removeEventListener("keydown", handleEnter);
  }, [refEl.current]);

  useEffect(() => {
    const custom = options.find((option) => option.customWrite);
    if (custom) {
      setprefix(custom.prefix || "");
    }
  }, [options]);

  useEffect(() => {
    setcurrentOption(options.find((v) => value === v.value));
  }, [value]);

  useHandleOutclick<HTMLDivElement>(refEl, () => {
    setfocused(false);
    setisOpened(false);
    refEl.current?.blur();
  });

  const updateValue = (option: Option): void => {
    setcurrentOption(option);
    changeFn(option.value);
    setisOpened(false);
    setcustomSelected(!!option.customWrite);
  };

  const handleClick = (): void => {
    if (!disabled) {
      setfocused(true);
      setisOpened(!isOpened);
      refEl.current?.focus();
    }
  };

  const handleCustomWrite = (val: string): void => {
    const prefixed = `${prefix}${val}`;
    setcustomValue(val);
    changeFn(prefixed);
  };

  return (
    <div
      ref={refEl}
      className={`app_flex_center  relative mb-8  app_input_top h-[40px] min-w-[150px] w-[fit-content] ${
        disabled && "app_input_disabled"
      } ${tailwindStyles}`}
      onClick={handleClick}>
      <div
        tabIndex={0}
        autoFocus={!!focus}
        id={inputId}
        className={`app_input peer ${focused ? "border-b-app_tertiary" : ""}   bg-transparent  px-1 my-1 ${selectWidth}`}>
        <div className="relative h-full flex items-center align-middle justify-between select-none text-[14px]">
          <span className={`${currentOption?.iconClass}`}>{currentOption?.label ?? "Select"}</span>
          <Icons.MdUnfoldMore className={`text-gray-700 transition-all duration-400 text-[18px] `} />
        </div>
        <div
          className={` z-10 absolute  transition-all duration-400 
          ${isOpened ? "max-h-[155px]" : " max-h-0"} overflow-y-auto bg-white
          top-[112%] w-full  left-0 rounded-[3px]  drop-shadow-xl  `}>
          {options?.map(({ label, value, iconClass, customWrite }, i) => (
            <div
              autoFocus={true}
              tabIndex={0}
              key={i}
              data-index={i}
              id={`${i}`}
              onClick={() => updateValue({ label, value, iconClass, customWrite })}
              className={` px-3 py-[5px]  overflow-hidden select-none text-[14px] ${
                value === currentOption?.value
                  ? "bg-app_tertiary text-white font-[500] select-active-option"
                  : "text-gray-600 hover:bg-app_tertiary_light hover:overflow-hidden"
              }`}>
              <span
                className={` ${
                  value === currentOption?.value ? "" : ""
                }flex items-center align-middle justify-between  ${iconClass}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {customSelected && (
        <InputWritten
          required
          type="text"
          name=""
          changeFn={(event: WrittenChangeEvent, val: string) => handleCustomWrite(val)}
          label="Write custom role"
          value={customValue}
          autoComplete="on"
          tailwindStyles="ml-5 max-w-[150px] w-[150px]"
          disabled={disabled}
        />
      )}
      <label
        htmlFor={inputId}
        className={` app_input_label ${required ? "required after:pl-1" : ""}`}>
        {label}
      </label>
    </div>
  );
};
