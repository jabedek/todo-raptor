import { generateInputId } from "frotsi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./InputTags.scss";
import { FormClearX, InputProps, InputTag, TagItem } from "@@components/common";
import { getTagWidth } from "./helpers";

type Props = Omit<InputProps, "changeFn" | "value"> & {
  values: TagItem[];
  hint?: string;
  changeFn: (val: TagItem[]) => void;
};

export const InputTags: React.FC<Props> = ({ values, hint, changeFn, name, label, disabled, required }) => {
  const inputId = useRef(generateInputId(name, name)).current;
  const ref = useRef<HTMLInputElement>(null);

  const [width, setwidth] = useState(`0px`);

  const [innerValues, setinnerValues] = useState<TagItem[]>([]);
  const [newTag, setnewTag] = useState<TagItem>();
  const [innerDisabled, setinnerDisabled] = useState(false);

  useEffect(() => {
    setinnerDisabled(!!innerDisabled);
  }, [disabled]);

  useEffect(() => {
    setinnerValues([...values]);
  }, [values]);

  useLayoutEffect(() => {
    const lettersWidth = getTagWidth(newTag?.value.length);
    setwidth(`${lettersWidth}px`);
  }, [newTag?.value]);

  useLayoutEffect(() => {
    const handleEvent = (e: MouseEvent): void => {
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

  const handleClick = (): void => {
    if (!disabled) {
      const tagId = generateInputId(name, "tag");
      setnewTag({ temporaryId: tagId, value: "" });
    }
  };

  const handleChange = (val: string): void => {
    if (newTag?.temporaryId) {
      setnewTag({ ...newTag, value: val });
    }
  };

  const handleBlur = (): void => {
    const newValues: TagItem[] = [...innerValues].filter((v: TagItem) => v.value && v.temporaryId);
    if (newTag?.temporaryId && newTag.value) {
      newValues.push({ ...newTag });
    }

    setnewTag(undefined);

    // this timeout prevents from awkward tags flickering on re-render
    setTimeout(() => {
      updateValues([...newValues]);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

  const onDelete = (_: React.MouseEvent, index: string): void => {
    updateValues([...values].filter((v) => v.temporaryId !== index));
  };

  const reset = (): void => {
    setnewTag(undefined);
    updateValues([]);
  };

  const updateValues = (values: TagItem[]): void => {
    setinnerValues(values);
    changeFn(values);
  };

  return (
    <div
      id={inputId}
      ref={ref}
      tabIndex={0}
      className={`${inputId} app_input_tags_wrapper   relative flex flex-wrap items-center content-start  justify-start my-5  min-h-[130px] min-w-[300px]  w-full border-[1px] border-solid border-gray-300
      ${label && label.length > 0 && "app_input_top"}
      ${!!disabled && "bg-slate-300"}`}>
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

      {!innerValues.length && !newTag && (
        <div
          className="tag absolute h-[32px] top-[8px] text-sm text-gray-300"
          onClick={handleClick}>
          Click to add a tag...
        </div>
      )}
      {label && label.length > 0 && (
        <label
          htmlFor={inputId}
          onClick={handleClick}
          className={`${inputId} peer app_input_label top-[-30px] whitespace-nowrap ${required ? "after:pl-1" : ""}`}>
          {label}
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

      {hint && (
        <p
          className={`${inputId} absolute top-[0%] hidden text-[11px] text-gray-900 bg-gray-200 shadow-lg py-1 px-3 rounded-sm h-[40px] min-w-[200px] leading-[14px] peer-hover:flex peer-hover:z-20`}>
          {hint}
        </p>
      )}
    </div>
  );
};
