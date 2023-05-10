import { CallbackFn } from "frotsi";

import { BasicInputsTypes } from "@@components/forms";

export type TagItem = {
  value: string;
  temporaryId: string;
};

export type InputTagsProps = Omit<BasicInputsTypes.InputProps, "value"> & {
  values: TagItem[];
  hint?: string;
  changeFn: CallbackFn;
};
