import { CallbackFn } from "frotsi";
import { useState } from "react";

import { AuthAPI } from "@@api/firebase";
import { User } from "@@types";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer } from "@@components/forms";
import { CheckProvidedCodeFn, useApiAccessValue } from "src/app/contexts/ApiAccessContext";

type Props = {
  user: User;
  neededToVerify: { mustProvideCode: boolean; mustVerifyEmail: boolean };
  checkCode: CallbackFn<Promise<any>>;
};

const AppCodeForm: React.FC<Props> = (props) => {
  const [messageCode, setmessageCode] = useState<ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<ResultDisplay>({ isError: false, text: "" });
  const [code, setcode] = useState("");

  const { hidePopup } = usePopupContext();

  const sendEmail = () => {
    AuthAPI.sendVerificationEmail((result: Error | void) => {
      sendEmailEffect(result);
    }, props.user?.authentication.verifEmailsAmount);
  };

  const sendEmailEffect = (result: Error | void) => {
    if (!(result instanceof Error)) {
      if (props.user?.authentication.verifEmailsAmount) {
        let message = "Email has been re-send. Check your email now and verify it (then refresh the page). ";
        if (props.neededToVerify.mustProvideCode === false) {
          message += "You can close this window.";
        }
        setmessageEmail({ text: message, isError: false });
      }
    } else {
      setmessageEmail({
        text: `Something went wrong while sending verificationDetails email: ${result.message}`,
        isError: true,
      });
    }
  };

  const submit = async () => {
    if (code) {
      props.checkCode(props.user.authentication.email, code).then((result) => {
        if (!!result) {
          let message = "Code is correct. ";
          if (props.neededToVerify.mustVerifyEmail === false) {
            message += "You can close this window.";
          }
          setmessageCode({ text: message, isError: false });
        } else {
          setmessageCode({ text: "Code is false.", isError: true });
        }
      });
    }
  };

  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] h-[200px]">
      <div className=" flex flex-col font-app_primary ">
        <p className="text-[16px] font-bold w-full text-center mb-2">To use this app fully:</p>
        {props.neededToVerify.mustVerifyEmail && (
          <div className="flex flex-col mt-8 mb-4">
            <p className="text-[13px] ">
              <span className="font-app_mono"> - Verify your email address in your mailbox (then refresh this page).</span>
            </p>
            <div className="w-auto app_flex_center mt-3">
              <Button
                clickFn={() => sendEmail()}
                formStyle="primary"
                label="Resend email"
              />
            </div>
            <ResultDisplayer message={messageEmail} />
          </div>
        )}

        {props.neededToVerify.mustProvideCode && (
          <>
            <div className="flex flex-col mt-2 mb-4">
              <p className="text-[13px] ">
                <span className="font-app_mono"> - Provide a code below - it should be given to you from the developer. </span>
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
            <ResultDisplayer
              message={messageCode}
              tailwindStyles=" whitespace-break-spaces"
            />
          </>
        )}
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
