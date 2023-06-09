import { useState } from "react";
import { CallbackFn } from "frotsi";

import { usePopupContext } from "@@components/Layout";
import { FormWrapper, InputCheckbox, Button } from "@@components/common";

type Props = {
  submitFn: CallbackFn;
  whatAction?: string;
  extraActionCheck?: string;
  closeOnSuccess?: boolean;
  irreversible?: boolean;
};

export const ConfirmDialog: React.FC<Props> = ({ submitFn, whatAction, extraActionCheck, closeOnSuccess, irreversible }) => {
  type Option = { value: string; label: string; checked: boolean };

  const { hidePopup } = usePopupContext();
  const [checked, setchecked] = useState(false);
  const handleSubmit = (): void => {
    submitFn(checked);
    if (closeOnSuccess) {
      hidePopup();
    }
  };
  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] min-h-[200px]">
      <div className="flex flex-col w-full">
        <p className="text-center">{`Are you sure you want to do this ${whatAction ? "(" + whatAction + ")" : ""}?`} </p>
      </div>

      {extraActionCheck && (
        <div className="w-full flex-col app_flex_center my-2 bg-gray-200 rounded-md p-3">
          <p className="w-full uppercase text-[12px] ">{extraActionCheck}</p>
          <InputCheckbox
            label={"Check"}
            changeFn={(val: Option[]) => setchecked(val[0].checked)}
            name="extra-action"
            options={[{ value: "opt-in", label: "opt-in", checked }]}
            tailwindStyles=""
          />
        </div>
      )}

      {irreversible && <p className="text-red-500 text-center text-[15px] font-bold my-2">This action is irreversible. </p>}

      <Button
        clickFn={handleSubmit}
        label="Submit"
        formStyle="primary"
      />
    </FormWrapper>
  );
};
