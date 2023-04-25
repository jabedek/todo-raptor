import { CallbackFn } from "frotsi";

import { BasicInputsTypes } from "@@components/FormElements";

export type TagItem = {
  value: string;
  id: string;
};

export type InputTagsProps = Omit<BasicInputsTypes.InputProps, "value"> & {
  values: TagItem[];
  hint?: string;
  changeFn: CallbackFn;
};
