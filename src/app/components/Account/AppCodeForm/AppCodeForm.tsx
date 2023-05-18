import { AuthAPI } from "@@api/firebase";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplayer } from "@@components/forms";
import { useUserValue } from "@@contexts";
import { CommonTypes } from "@@types";
import { CallbackFn } from "frotsi";
import { useState } from "react";

type Props = {};

const AppCodeForm: React.FC<Props> = ({}) => {
  const [messageCode, setmessageCode] = useState<CommonTypes.ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<CommonTypes.ResultDisplay>({ isError: false, text: "" });
  const { submitCode, user, firebaseAuthUser } = useUserValue();
  const [code, setcode] = useState("");
  const { hidePopup } = usePopupContext();

  const sendEmail = () => {
    if (user) {
      AuthAPI.sendVerificationEmail((result: Error | void) => {
        sendEmailEffect(result);
      }, user?.authentication.verifEmailsAmount);
    }
  };

  const sendEmailEffect = (result: Error | void) => {
    if (user) {
      if (!(result instanceof Error)) {
        if (user?.authentication.verifEmailsAmount) {
          setmessageEmail({ text: "Email has been re-send. Check your email now and verify it.", isError: false });
        }
      } else {
        setmessageEmail({
          text: `Something went wrong while sending verificationDetails email: ${result.message}`,
          isError: true,
        });
      }
    }
  };
  const submitCodeEffect = (
    result:
      | {
          codeValid: boolean;
          emailVerif: boolean;
        }
      | Error
      | void
  ) => {
    if (result) {
      if (!(result instanceof Error)) {
        setmessageCode({ text: "Code has been submitted and it is valid.", isError: false });
        hidePopup();
      } else {
        setmessageCode({
          text: `Something went wrong while submitting the code email: ${result.message}`,
          isError: true,
        });
      }
    }
  };

  const submit = () => {
    submitCode(code, submitCodeEffect);
  };

  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] h-[200px]">
      <div className=" flex flex-col font-app_primary ">
        <p className="text-[16px] font-bold w-full text-center mb-2">To use this app fully:</p>
        {!firebaseAuthUser?.emailVerified && (
          <div className="flex flex-col mt-2 mb-4">
            <p className="text-[13px] ">
              <span className="font-app_mono"> - </span> Verify your email address in your mailbox (then refresh this page).
            </p>
            <div className="w-auto app_flex_center">
              <Button
                clickFn={() => sendEmail()}
                formStyle="primary"
                label="Resend email"
              />
            </div>
            <ResultDisplayer message={messageEmail} />
          </div>
        )}
        <div className="flex flex-col mt-2 mb-4">
          <p className="text-[13px] ">
            <span className="font-app_mono"> - </span> Provide a code below - it should be given to you from the developer.
          </p>
        </div>
        <div className="w-auto app_flex_center">
          <InputWritten
            changeFn={(val) => setcode(val)}
            name="code"
            value={code}
            focus={true}
            type="text"
          />
        </div>
        <ResultDisplayer message={messageCode} />
      </div>

      <Button
        clickFn={submit}
        label="Submit"
        formStyle="primary"
        disabled={code.length != 19}
      />
    </FormWrapper>
  );
};

export default AppCodeForm;
