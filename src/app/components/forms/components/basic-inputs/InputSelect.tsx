import { generateInputId } from "frotsi";
import { useEffect, useState, useRef } from "react";
import { MdUnfoldMore } from "react-icons/md";

import { useHandleOutclick } from "@@hooks";
import { BasicInputsTypes } from "@@components/forms";

const InputSelect: React.FC<BasicInputsTypes.InputSelectProps> = (props) => {
  type Option = BasicInputsTypes.SelectOption<typeof props.selectOptions>;
  const [focus, setfocus] = useState(false);
  const [isOpened, setisOpened] = useState(false);
  const [currentOption, setcurrentOption] = useState(props.selectOptions.find((v) => props.value === v.value));
  const inputId = useRef(generateInputId(props.name, "select")).current;
  const refEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const index = (e.target as HTMLDivElement).dataset["index"] || -1;
        const option: Option = props.selectOptions[index];
        if (option) {
          handleSelect(option);
        }

        if (!isOpened) {
          setisOpened(true);
        }
      }
    };

    refEl.current?.addEventListener("keydown", handleEnter);

    return () => refEl.current?.removeEventListener("keydown", handleEnter);
  }, [refEl.current]);

  useHandleOutclick<HTMLDivElement>(refEl, (e: any) => {
    setfocus(false);
    setisOpened(false);
    refEl.current?.blur();
  });

  const handleSelect = (option: Option) => {
    setcurrentOption(option);
    props.changeFn(option.value);
    setisOpened(false);
  };

  const handleClick = () => {
    setfocus(true);
    setisOpened(!isOpened);
    refEl.current?.focus();
  };

  return (
    <div
      ref={refEl}
      className={`${inputId} relative my-5 app_input_top h-[40px] w-[150px] ${props.tailwindStyles}`}
      onClick={handleClick}>
      <div
        tabIndex={0}
        autoFocus={!!props.focus}
        id={inputId}
        className={`app_input peer  ${inputId}  ${focus ? "border-b-app_tertiary" : ""} 
        bg-transparent  px-1 my-1`}>
        <div className="relative h-full flex items-center align-middle justify-between select-none text-[14px]">
          <span className={`${currentOption?.iconClass}`}>{currentOption?.label ?? "Select"}</span>
          <MdUnfoldMore className={`text-gray-700 transition-all duration-400 text-[18px] `} />
        </div>
        <div
          className={`${inputId} z-10 absolute  transition-all duration-400 
          ${isOpened ? "max-h-[155px]" : " max-h-0"} overflow-y-auto bg-white
          top-[112%] w-full  left-0 rounded-[3px]  drop-shadow-xl  `}>
          {props.selectOptions?.map(({ label, value, iconClass }, i) => (
            <div
              autoFocus={true}
              tabIndex={0}
              key={i}
              data-index={i}
              id={`${i}`}
              onClick={() => handleSelect({ label, value, iconClass })}
              className={` px-3 py-[5px]  overflow-hidden select-none text-[14px]
              ${inputId}  
              ${
                value === currentOption?.value
                  ? "bg-app_tertiary text-white font-[500]"
                  : "text-gray-600 hover:bg-app_tertiary_light hover:overflow-hidden"
              }`}>
              <span className={`flex items-center align-middle justify-between  ${iconClass}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <label
        htmlFor={inputId}
        className={`${inputId} app_input_label ${props.required ? "required after:pl-1" : ""}`}>
        {props.label}
      </label>
    </div>
  );
};

export default InputSelect;
