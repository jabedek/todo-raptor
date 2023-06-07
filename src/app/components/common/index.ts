import { InputCheckbox } from "./forms/components/basic-inputs/InputCheckbox";
import { InputDate } from "./forms/components/basic-inputs/InputDate";
import { InputRadios } from "./forms/components/basic-inputs/InputRadios";
import { InputSelect } from "./forms/components/basic-inputs/InputSelect";
import { InputWritten } from "./forms/components/basic-inputs/InputWritten";
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
} from "./forms/components/basic-inputs/types";
import { ConfirmDialog } from "./forms/components/common/ConfirmDialog";
import { FormClearX } from "./forms/components/common/FormClearX";
import { FormWrapper } from "./forms/components/common/FormWrapper";
import { ResultDisplayer, ResultDisplay } from "./forms/components/common/ResultDisplayer";
import { InputTag } from "./forms/components/complex-inputs/InputTags/InputTag/InputTag";
import { InputTags } from "./forms/components/complex-inputs/InputTags/InputTags";
import { TagItem } from "./forms/components/complex-inputs/InputTags/types";
import { getHint, validate, validateEmailPassword, validateInput } from "./forms/simple-validation";

//
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { SidePanel } from "./SidePanel";

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
  //
  Button,
  LoadingSpinner,
  SidePanel,
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
