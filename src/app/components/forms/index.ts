import { ResultDisplay } from "./components/common/ResultDisplayer/ResultDisplayer";
import FormClearX from "./components/form-buttons/FormClearX";

import FormWrapper from "./components/common/FormWrapper";
import ResultDisplayer from "./components/common/ResultDisplayer/ResultDisplayer";
import ConfirmDialog from "./components/common/ConfirmDialog";

import InputDate from "./components/basic-inputs/InputDate";
import InputRadios from "./components/basic-inputs/InputRadios";
import InputSelect from "./components/basic-inputs/InputSelect";
import InputWritten from "./components/basic-inputs/InputWritten";

import {
  InputChoiceType,
  InputDateTimeType,
  InputProps,
  InputSpecifics,
  InputType,
  InputWrittenType,
  SelectOption,
} from "./components/basic-inputs/types";
import { TagItem } from "@@components/forms/components/complex-inputs/InputTags/types";
import InputTags from "@@components/forms/components/complex-inputs/InputTags/InputTags";
import InputCheckbox from "./components/basic-inputs/InputCheckbox";

export {
  //
  FormClearX,
  InputDate,
  InputRadios,
  InputCheckbox,
  InputSelect,
  InputWritten,
  InputTags,
  //
  FormWrapper,
  ResultDisplayer,
  ConfirmDialog,

  //
};

export type {
  InputDateTimeType,
  InputChoiceType,
  InputWrittenType,
  InputProps,
  InputSpecifics,
  InputType,
  SelectOption,
  //
  ResultDisplay,
  TagItem,
};
