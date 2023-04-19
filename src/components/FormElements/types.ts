import { CallbackFn } from "frotsi";

type InputDateTime = "date" | "month" | "time" | "week";
type InputChoice = "checkbox" | "radio" | "select";
type InputWritten = "text" | "email" | "password" | "number" | "search" | "url" | "tel" | "textarea";
export type InputType = InputDateTime | InputChoice | InputWritten;

type SideEffectCallback<E extends HTMLElement = HTMLElement> = (inputId: string, event: React.ChangeEvent<E>) => any;

export type InputSpecifics = {
  // TODO: in future instead of [key:string] create details for most variants like options of 'select'/'checkbox'; steps, mins and max of 'range', etc.
  minTime?: string;
  maxTime?: string;
  maxLength?: number;
  minLength?: number;
  multiple?: boolean; // for 'email' and 'file'
  [key: string]: any;
};

export type SelectOption<T> = {
  label: string;
  value: T;
  iconClass?: string;
};

export type RadioOption<T> = SelectOption<T> & { customWrite?: boolean; default?: boolean };

// BASIC
type Input = {
  value: any;
  name: string;
  onChange: CallbackFn<any>;
  /** Could return errors or smth. */
  onChangeSideEffect?: SideEffectCallback;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  tailwindStyles?: string;
};

export type InputWrittenProps = Input & {
  type: InputWritten;
  inputTypeSpecs?: InputSpecifics;
  pattern?: string;
  focus?: boolean;
  hint?: string;
  autoComplete?: string;
};
export type InputDateProps = Input & {
  type: InputDateTime;
  inputTypeSpecs?: InputSpecifics;
  focus?: boolean;
};

export type InputSelectProps = Input & {
  inputTypeSpecs?: InputSpecifics;
  selectOptions: SelectOption<any>[];
  focus?: boolean;
};

export type InputRadiosProps = Omit<Input, "value"> & {
  radioOptions: RadioOption<any>[];
  orientation?: "horizontal" | "vertical";
};

export type TagItem = {
  value: string;
  id: string;
};

// COMPLEX
export type InputTagsProps = Omit<Input, "value"> & {
  values: TagItem[];
  hint?: string;
};

///////////

type MyPick<T, K extends keyof T> = { [Key in K]: T[Key] };

type Test = {
  a: string;
  b: string;
  c: string;
};

type NewTest = MyPick<Test, "b" | "c">;
