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
export type InputProps = {
  value: any;
  name: string;
  changeFn: CallbackFn<any>;
  /** Could return errors or smth. */
  changeSideEffectFn?: SideEffectCallback;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  tailwindStyles?: string;
};

export type InputWrittenProps = InputProps & {
  type: InputWritten;
  inputTypeSpecs?: InputSpecifics;
  pattern?: string;
  focus?: boolean;
  hint?: string;
  autoComplete?: string;
};
export type InputDateProps = InputProps & {
  type: InputDateTime;
  inputTypeSpecs?: InputSpecifics;
  focus?: boolean;
};

export type InputSelectProps = InputProps & {
  inputTypeSpecs?: InputSpecifics;
  selectOptions: SelectOption<any>[];
  focus?: boolean;
};

export type InputRadiosProps = Omit<InputProps, "value"> & {
  radioOptions: RadioOption<any>[];
  orientation?: "horizontal" | "vertical";
};
