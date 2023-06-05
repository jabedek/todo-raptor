import { ResultDisplay } from "./components/common/ResultDisplayer";
import { FormClearX } from "./components/common/FormClearX";

import { FormWrapper } from "./components/common/FormWrapper";
import { ResultDisplayer } from "./components/common/ResultDisplayer";
import { ConfirmDialog } from "./components/common/ConfirmDialog";

import { InputDate } from "./components/basic-inputs/InputDate";
import { InputRadios } from "./components/basic-inputs/InputRadios";
import { InputSelect } from "./components/basic-inputs/InputSelect";
import { InputWritten } from "./components/basic-inputs/InputWritten";

import { TagItem } from "@@components/forms/components/complex-inputs/InputTags/types";
import { InputTag } from "@@components/forms/components/complex-inputs/InputTags/InputTag/InputTag";
import { InputTags } from "@@components/forms/components/complex-inputs/InputTags/InputTags";
import { InputCheckbox } from "./components/basic-inputs/InputCheckbox";

import {
  WrittenChangeEvent,
  InputChangeEvent,
  InputChoiceType,
  InputDateTimeType,
  InputProps,
  InputSpecifics,
  InputType,
  InputWrittenType,
  SelectOption,
  TextareaChangeEvent,
} from "@@components/forms/components/basic-inputs/types";

import { getHint, validate, validateEmailPassword, validateInput } from "./simple-validation";

export {
  //
  FormClearX,
  InputDate,
  InputRadios,
  InputCheckbox,
  InputSelect,
  InputWritten,
  InputTags,
  InputTag,
  //
  FormWrapper,
  ResultDisplayer,
  ConfirmDialog,

  //
  getHint,
  validate,
  validateEmailPassword,
  validateInput,
};

export type {
  WrittenChangeEvent,
  InputChangeEvent,
  InputChoiceType,
  InputDateTimeType,
  InputProps,
  InputSpecifics,
  InputType,
  InputWrittenType,
  SelectOption,
  TextareaChangeEvent,
  //
  ResultDisplay,
  TagItem,
};
