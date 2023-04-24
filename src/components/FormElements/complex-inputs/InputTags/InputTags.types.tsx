import { InputProps } from "@@components/FormElements/types";

export type TagItem = {
  value: string;
  id: string;
};

// COMPLEX
export type InputTagsProps = Omit<InputProps, "value"> & {
  values: TagItem[];
  hint?: string;
};
