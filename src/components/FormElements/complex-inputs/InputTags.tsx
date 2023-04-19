import { CallbackFn, createInputId } from "frotsi";
import { InputTagsProps, TagItem } from "../types";
import { useEffect, useRef, useState, useMemo } from "react";
import { useHandleClickOutside } from "@@hooks/useHandleClickOutside";
import { MdClear } from "react-icons/md";
import RenderObject from "@@components/common/RenderObject";

function getWidth(length = 0) {
  return 36 + length * 7.8;
}

type TagProps = {
  onDelete: CallbackFn;
  item: TagItem;
};

const Tag: React.FC<TagProps> = ({ onDelete, item }) => {
  const [width, setwidth] = useState(`0px`);

  useEffect(() => {
    const lettersWidth = getWidth(item.value?.length);
    setwidth(`${lettersWidth}px`);
  }, [item.value]);

  return (
    <div
      id={"tag#" + item.id}
      className="app_tag_wrapper transition-all duration-200 tag flex relative"
      style={{ width: width }}>
      <div
        style={{ width: width }}
        className={`transition-all duration-200 absolute app_input_tags font-app_mono`}
        onBlur={() => {}}>
        <span className="">{item.value}</span>
        <div className="tag-remove absolute ">
          <MdClear
            className="rounded-full text-red-700 transition-all duration-200 hover:rotate-180 cursor-pointer hover:text-red-500"
            onClick={() => onDelete(item.id)}
          />
        </div>
      </div>
    </div>
  );
};

const InputTags: React.FC<InputTagsProps> = (props) => {
  const inputId = useRef(createInputId(props.name, "tags")).current;
  const ref = useRef<HTMLInputElement>(null);

  const [focus, setfocus] = useState(false);
  const [width, setwidth] = useState(`0px`);

  const [values, setvalues] = useState<TagItem[]>(props.values);
  const [newTag, setnewTag] = useState<TagItem>();

  useEffect(() => {
    const lettersWidth = getWidth(newTag?.value.length);
    setwidth(`${lettersWidth}px`);
  }, [newTag?.value]);

  useEffect(() => {
    const handleEvent = (e: MouseEvent) => {
      const localElement = (e.target as HTMLElement).classList.contains(inputId);
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
    console.log(newTag);
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

    // this timeout prevents from awkward tags flicerking on re-render
    setTimeout(() => {
      setvalues([...newValues]);
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter": {
        handleBlur();

        // this timeout prevents from awkward tags flicerking on re-render
        setTimeout(() => {
          handleClick();
        }, 100);
        break;
      }
      case "Escape": {
        setnewTag(undefined);
        break;
      }
    }
  };

  const onDelete = (index: string) => {
    setvalues([...values].filter((v) => v.id !== index));
  };

  const reset = () => {
    setnewTag(undefined);
    setvalues([]);
  };

  return (
    <div
      id={inputId}
      ref={ref}
      className={`${inputId} app_input_tags_wrapper   relative flex flex-wrap items-center content-start  justify-start mt-6 my-1 min-h-[130px] min-w-[300px]  w-full border-[1px] border-solid border-gray-300
      ${props.label && props.label.length > 0 && "app_input_top"}`}
      onFocus={() => setfocus(true)}
      onBlur={() => setfocus(false)}>
      {values.length > 0 &&
        values.map((val, i) => {
          return (
            <Tag
              key={i}
              onDelete={onDelete}
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
          className={`${inputId} app_input_label top-[-30px] whitespace-nowrap ${props.required ? "after:pl-1" : ""}`}>
          {props.label}
        </label>
      )}

      <div className="tags-reset absolute ">
        <MdClear
          className="rounded-full text-red-800 transition-all duration-200 hover:rotate-180 cursor-pointer hover:text-red-600"
          onClick={reset}
        />
      </div>
    </div>
  );
};

export default InputTags;
