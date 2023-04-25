import { CallbackFn } from "frotsi";
import { useState, useEffect } from "react";

import { FormClearX, InputTagsTypes } from "@@components/FormElements";
import { getTagWidth } from "../helpers";

type TagProps = {
  deleteFn: CallbackFn;
  item: InputTagsTypes.TagItem;
};

const InputTag: React.FC<TagProps> = ({ deleteFn, item }) => {
  const [width, setwidth] = useState(`0px`);

  useEffect(() => {
    const lettersWidth = getTagWidth(item.value?.length);
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

        <div className="tag-remove  ">
          <FormClearX
            clickFn={deleteFn}
            relatedItemId={item.id}
            sizeVariant="I"
          />
        </div>
      </div>
    </div>
  );
};

export default InputTag;
