import { CallbackFn, generateInputId } from "frotsi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./InputTags.scss";
import { FormClearX, InputProps, TagItem } from "@@components/forms";
import { getTagWidth } from "./helpers";
import InputTag from "./InputTag/InputTag";

type Props = Omit<InputProps, "value"> & {
  values: TagItem[];
  hint?: string;
  changeFn: CallbackFn;
};

const InputTags: React.FC<Props> = (props) => {
  const inputId = useRef(generateInputId(props.name, props.name)).current;
  const ref = useRef<HTMLInputElement>(null);

  const [width, setwidth] = useState(`0px`);

  const [values, setvalues] = useState<TagItem[]>([]);
  const [newTag, setnewTag] = useState<TagItem>();
  const [disabled, setdisabled] = useState(false);

  useEffect(() => {
    setdisabled(!!props.disabled);
  }, [props.disabled]);

  useEffect(() => {
    setvalues([...props.values]);
  }, [props.values]);

  useLayoutEffect(() => {
    const lettersWidth = getTagWidth(newTag?.value.length);
    setwidth(`${lettersWidth}px`);
  }, [newTag?.value]);

  useLayoutEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      const thisElement = (e.target as HTMLElement).id === inputId;
      if (thisElement) {
        if (!newTag?.temporaryId && !disabled) {
          handleClick();
        }
      }
    };

    ref.current?.addEventListener("click", handleEvent);
    return () => ref.current?.removeEventListener("click", handleEvent);
  }, [ref.current]);

  const handleClick = () => {
    if (!disabled) {
      const tagId = generateInputId(props.name, "tag");
      setnewTag({ temporaryId: tagId, value: "" });
    }
  };

  const handleChange = (val: string) => {
    if (newTag?.temporaryId) {
      setnewTag({ ...newTag, value: val });
    }
  };

  const handleBlur = () => {
    const newValues: TagItem[] = [...values].filter((v: TagItem) => v.value && v.temporaryId);
    if (newTag?.temporaryId && newTag.value) {
      newValues.push({ ...newTag });
    }

    setnewTag(undefined);

    // this timeout prevents from awkward tags flickering on re-render
    setTimeout(() => {
      updateValues([...newValues]);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case ",":
      case "Enter":
        handleBlur();

        // this timeout prevents from awkward tags flicerking on re-render
        setTimeout(() => {
          handleClick();
        }, 200);
        break;
      case "Escape":
        setnewTag(undefined);
        break;
    }
  };

  const onDelete = (_: React.MouseEvent, index: string) => {
    updateValues([...values].filter((v) => v.temporaryId !== index));
  };

  const reset = (_: React.MouseEvent) => {
    setnewTag(undefined);
    updateValues([]);
  };

  const updateValues = (values: TagItem[]) => {
    setvalues(values);
    props.changeFn(values);
  };

  return (
    <div
      id={inputId}
      ref={ref}
      tabIndex={0}
      className={`${inputId} app_input_tags_wrapper   relative flex flex-wrap items-center content-start  justify-start mt-8 mb-6  min-h-[130px] min-w-[300px]  w-full border-[1px] border-solid border-gray-300
      ${props.label && props.label.length > 0 && "app_input_top"}
      ${!!props?.disabled && "bg-slate-300"}`}>
      {values.length > 0 &&
        values.map((val, i) => {
          return (
            <InputTag
              key={i}
              deleteFn={onDelete}
              item={val}
            />
          );
        })}
      {!disabled && newTag?.temporaryId && (
        <div
          className="app_new_tag_wrapper transition-all duration-200 tag flex relative min-w-[54px]"
          style={{ width: width }}>
          <input
            autoFocus
            style={{ width: width }}
            type="text"
            value={newTag?.value}
            minLength={1}
            maxLength={17}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.currentTarget.value)}
            className={`app_input_tags ${inputId} transition-all duration-200 absolute min-w-[45px] font-app_mono`}></input>
        </div>
      )}

      {!values.length && !newTag && (
        <div
          className="tag absolute h-[32px] top-[8px] text-sm text-gray-300"
          onClick={handleClick}>
          Click to add a tag...
        </div>
      )}
      {props.label && props.label.length > 0 && (
        <label
          htmlFor={inputId}
          onClick={handleClick}
          className={`${inputId} peer app_input_label top-[-30px] whitespace-nowrap ${props.required ? "after:pl-1" : ""}`}>
          {props.label}
        </label>
      )}

      {!!values.length && (
        <div className="tags-reset  ">
          <FormClearX
            clickFn={reset}
            sizeVariant="II"
          />
        </div>
      )}

      {props.hint && (
        <p
          className={`${inputId} absolute top-[0%] hidden text-[11px] text-gray-900 bg-gray-200 shadow-lg py-1 px-3 rounded-sm h-[40px] min-w-[200px] leading-[14px] peer-hover:flex peer-hover:z-20`}>
          {props.hint}
        </p>
      )}
    </div>
  );
};

export default InputTags;
