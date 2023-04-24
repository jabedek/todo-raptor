import { createInputId } from "frotsi";
import { InputTagsProps, TagItem } from "./InputTags.types";
import { useEffect, useRef, useState } from "react";
import { getTagWidth } from "./utils";
import FormClearX from "@@components/FormElements/form-buttons/FormClearX";
import Tag from "./Tag";

const InputTags: React.FC<InputTagsProps> = (props) => {
  const inputId = useRef(createInputId(props.name, "tags")).current;
  const ref = useRef<HTMLInputElement>(null);

  const [width, setwidth] = useState(`0px`);

  const [values, setvalues] = useState<TagItem[]>(props.values);
  const [newTag, setnewTag] = useState<TagItem>();

  useEffect(() => {
    const lettersWidth = getTagWidth(newTag?.value.length);
    setwidth(`${lettersWidth}px`);
  }, [newTag?.value]);

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      const thisElement = (e.target as HTMLElement).id === inputId;
      if (thisElement) {
        if (!newTag?.id) {
          handleClick();
        }
      }
    };

    ref.current?.addEventListener("click", handleEvent);
    return () => ref.current?.removeEventListener("click", handleEvent);
  }, [ref.current]);

  const handleClick = () => {
    const tagId = createInputId(props.name, "tag");
    setnewTag({ id: tagId, value: "" });
  };

  const handleChange = (val: string) => {
    if (newTag?.id) {
      setnewTag({ ...newTag, value: val });
    }
  };

  const handleBlur = () => {
    const newValues: TagItem[] = [...values].filter((v: TagItem) => v.value && v.id);
    if (newTag?.id && newTag.value) {
      newValues.push({ ...newTag });
    }

    setnewTag(undefined);

    // this timeout prevents from awkward tags flickering on re-render
    setTimeout(() => {
      setvalues([...newValues]);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e.key);

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
    setvalues([...values].filter((v) => v.id !== index));
  };

  const reset = (_: React.MouseEvent) => {
    setnewTag(undefined);
    setvalues([]);
  };

  return (
    <div
      id={inputId}
      ref={ref}
      className={`${inputId} app_input_tags_wrapper   relative flex flex-wrap items-center content-start  justify-start mt-8 mb-6  min-h-[130px] min-w-[300px]  w-full border-[1px] border-solid border-gray-300
      ${props.label && props.label.length > 0 && "app_input_top"}`}>
      {values.length > 0 &&
        values.map((val, i) => {
          return (
            <Tag
              key={i}
              deleteFn={onDelete}
              item={val}
            />
          );
        })}
      {newTag?.id && (
        <div
          className="app_new_tag_wrapper transition-all duration-200 tag flex relative min-w-[54px]"
          style={{ width: width }}>
          <input
            autoFocus
            style={{ width: width }}
            type="text"
            value={newTag?.value}
            minLength={1}
            maxLength={20}
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
          className={`${inputId} app_input_label top-[-30px] whitespace-nowrap ${props.required ? "after:pl-1" : ""}`}>
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
    </div>
  );
};

export default InputTags;
