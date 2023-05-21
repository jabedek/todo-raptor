import { generateInputId } from "frotsi";
import { useEffect, useState, useRef } from "react";
import { useHandleOutclick } from "@@hooks";
import { InputProps, InputSpecifics, InputWritten, SelectOption } from "@@components/forms";
import { Icons } from "@@components/Layout";

type Props = InputProps & {
  inputTypeSpecs?: InputSpecifics;
  options: SelectOption<any>[];
  focus?: boolean;
  selectWidth?: string;
};

const InputSelect: React.FC<Props> = (props) => {
  type Option = SelectOption<typeof props.options>;
  const [focus, setfocus] = useState(false);
  const [isOpened, setisOpened] = useState(false);
  const [currentOption, setcurrentOption] = useState<Option>();
  const inputId = useRef(generateInputId(props.name, "select")).current;
  const refEl = useRef<HTMLDivElement>(null);
  const [customSelected, setcustomSelected] = useState(false);
  const [customValue, setcustomValue] = useState("");
  const [prefix, setprefix] = useState("");

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const index = (e.target as HTMLDivElement).dataset["index"] || -1;
        const option: Option = props.options[index];
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
    const custom = props.options.find((option) => option.customWrite);
    if (custom) {
      setprefix(custom.prefix || "");
    }
  }, [props.options]);

  useEffect(() => {
    setcurrentOption(props.options.find((v) => props.value === v.value));
  }, [props.value]);

  useHandleOutclick<HTMLDivElement>(refEl, (e: any) => {
    setfocus(false);
    setisOpened(false);
    refEl.current?.blur();
  });

  const updateValue = (option: Option) => {
    setcurrentOption(option);
    props.changeFn(option.value);
    setisOpened(false);
    setcustomSelected(!!option.customWrite);
  };

  const handleClick = () => {
    if (!props.disabled) {
      setfocus(true);
      setisOpened(!isOpened);
      refEl.current?.focus();
    }
  };

  const handleCustomWrite = (val: string) => {
    const prefixed = `${prefix}${val}`;
    setcustomValue(val);
    props.changeFn(prefixed);
  };

  return (
    <div
      ref={refEl}
      className={`app_flex_center  relative my-5 app_input_top h-[40px] min-w-[150px] w-[fit-content] ${
        props.disabled && "app_input_disabled"
      } ${props.tailwindStyles}`}
      onClick={handleClick}>
      <div
        tabIndex={0}
        autoFocus={!!props.focus}
        id={inputId}
        className={`app_input peer ${focus ? "border-b-app_tertiary" : ""}   bg-transparent  px-1 my-1 ${props.selectWidth}`}>
        <div className="relative h-full flex items-center align-middle justify-between select-none text-[14px]">
          <span className={`${currentOption?.iconClass}`}>{currentOption?.label ?? "Select"}</span>
          <Icons.MdUnfoldMore className={`text-gray-700 transition-all duration-400 text-[18px] `} />
        </div>
        <div
          className={` z-10 absolute  transition-all duration-400 
          ${isOpened ? "max-h-[155px]" : " max-h-0"} overflow-y-auto bg-white
          top-[112%] w-full  left-0 rounded-[3px]  drop-shadow-xl  `}>
          {props.options?.map(({ label, value, iconClass, customWrite }, i) => (
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
              <span className={`flex items-center align-middle justify-between  ${iconClass}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
      {customSelected && (
        <InputWritten
          required
          type="text"
          name=""
          changeFn={(val) => handleCustomWrite(val)}
          label="Write custom role"
          value={customValue}
          autoComplete="on"
          tailwindStyles="ml-5 max-w-[150px] w-[150px]"
          disabled={props.disabled}
        />
      )}
      <label
        htmlFor={inputId}
        className={` app_input_label ${props.required ? "required after:pl-1" : ""}`}>
        {props.label}
      </label>
    </div>
  );
};

export default InputSelect;
