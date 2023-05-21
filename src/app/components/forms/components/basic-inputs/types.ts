import { CallbackFn } from "frotsi";

export type InputDateTimeType = "date" | "month" | "time" | "week";
export type InputChoiceType = "checkbox" | "radio" | "select";
export type InputWrittenType = "text" | "email" | "password" | "number" | "search" | "url" | "tel" | "textarea";
export type InputType = InputDateTimeType | InputChoiceType | InputWrittenType;

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
  value: T;
  label: string;
  iconClass?: string;
  prefix?: string;
  customWrite?: boolean;
};

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
