import { CallbackFn } from "frotsi";
import { useState } from "react";

import { AuthAPI } from "@@api/firebase";
import { User } from "@@types";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer } from "@@components/forms";

type Props = {
  submitFn: CallbackFn;
  user: User | undefined;
  emailVerified: boolean;
  neededToVerify: { codeNeeded: boolean; emailNeeded: boolean };
};

const AppCodeForm: React.FC<Props> = (props) => {
  const [messageCode, setmessageCode] = useState<ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<ResultDisplay>({ isError: false, text: "" });
  const [code, setcode] = useState("");
  const { hidePopup } = usePopupContext();

  const sendEmail = () => {
    if (props.user) {
      AuthAPI.sendVerificationEmail((result: Error | void) => {
        sendEmailEffect(result);
      }, props.user?.authentication.verifEmailsAmount);
    }
  };

  const sendEmailEffect = (result: Error | void) => {
    if (props.user) {
      if (!(result instanceof Error)) {
        if (props.user?.authentication.verifEmailsAmount) {
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

  const submit = async () => {
    if (code) {
      console.log(code);

      (props.submitFn(code) as unknown as Promise<boolean>).then((result) => {
        if (!!result && !props.neededToVerify.emailNeeded) {
          setmessageEmail({ text: "Code is correct.", isError: false });
        } else {
          setmessageEmail({ text: "Code is false.", isError: true });
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
        {(!props.emailVerified || props.neededToVerify.emailNeeded) && (
          <div className="flex flex-col mt-8 mb-4">
            <p className="text-[13px] ">
              <span className="font-app_mono"> - </span> Verify your email address in your mailbox (then refresh this page).
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

        {props.neededToVerify.codeNeeded && (
          <>
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
