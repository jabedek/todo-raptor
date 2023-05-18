import { CallbackFn } from "frotsi";
import FormWrapper from "./FormWrapper";
import { Button } from "@@components/common";
import { usePopupContext } from "@@components/Layout";

type Props = {
  submitFn: CallbackFn;
  whatAction?: string;
  closeOnSuccess?: boolean;
};

const ConfirmDialog: React.FC<Props> = ({ submitFn, whatAction, closeOnSuccess }) => {
  const { hidePopup } = usePopupContext();
  const handleSubmit = () => {
    submitFn();
    if (closeOnSuccess) {
      hidePopup();
    }
  };
  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] h-[200px]">
      <p>{`Are you sure you want to do this ${whatAction ? "(" + whatAction + ")" : ""}?`}</p>
      <Button
        clickFn={handleSubmit}
        label="Submit"
        formStyle="primary"
      />
    </FormWrapper>
  );
};

export default ConfirmDialog;
