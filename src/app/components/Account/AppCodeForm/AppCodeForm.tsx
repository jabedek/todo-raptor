import { CallbackFn } from "frotsi";
import { useState } from "react";

import { AuthAPI } from "@@api/firebase";
import { User } from "@@types";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer } from "@@components/forms";
import { CheckProvidedCodeFn, LackingValidations, useApiAccessValue } from "src/app/contexts/ApiAccessContext";

type Props = {
  user: User | undefined;
  neededToVerify: { mustProvideCode: boolean; mustVerifyEmail: boolean };
  checkCode: CallbackFn<Promise<any>>;
};

const AppCodeForm: React.FC<Props> = (props) => {
  const [messageCode, setmessageCode] = useState<ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<ResultDisplay>({ isError: false, text: "" });
  const [code, setcode] = useState("");

  const sendEmail = () => {
    if (props.user) {
      AuthAPI.sendVerificationEmail((result: Error | void) => {
        sendEmailEffect(result);
      }, props.user?.authentication.verifEmailsAmount);
    }
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
      setmessageCode({ text: "", isError: false });
      const email = props.user?.authentication.email || "";
      props.checkCode(email, code).then((result: LackingValidations) => {
        if (!!result.validAppCode) {
          let message = "Code is correct. ";
          setcode("");
          if (result.verifiedEmail) {
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
      tailwindStyles="w-[500px] min-h-fit ">
      <div className=" flex flex-col items-center gap-12 w-full justify-between font-app_primary px-1 py-3">
        <p className="py-1 text-[17px] font-app_primary uppercase font-bold">To use this app fully:</p>
        {props.user && props.neededToVerify.mustVerifyEmail && (
          <div className="flex-col app_flex_center h-[230px] w-[90%] px-2 bg-gray-100 py-2 rounded-[4px]">
            <p className="app_flex_center  text-center text-[15px] w-full  h-fit font-bold whitespace-pre-line ">
              {`Verify your email address in your mailbox \n(then refresh this page)`}
            </p>
            <div className="h-[120px] flex-col w-auto app_flex_center">
              <ResultDisplayer
                message={messageEmail}
                tailwindStyles=" whitespace-break-spaces"
              />
              <Button
                clickFn={() => sendEmail()}
                formStyle="primary"
                label="Resend email"
              />
            </div>
          </div>
        )}

        {props.neededToVerify.mustProvideCode && (
          <div className="flex-col app_flex_center h-[310px] w-[90%] px-2  bg-gray-100 py-2 rounded-[4px]">
            <p className="app_flex_center  text-center text-[15px] w-full  h-fit font-bold whitespace-pre-line ">
              {`Provide a code below. \nIt should be given to you from a developer`}
            </p>
            <div className="h-[200px] flex-col w-auto app_flex_center">
              <InputWritten
                changeFn={(val) => setcode(val)}
                name="code"
                value={code}
                focus={true}
                type="text"
              />
              <ResultDisplayer
                message={messageCode}
                tailwindStyles=" whitespace-break-spaces"
              />

              <Button
                clickFn={submit}
                label="Submit"
                formStyle="primary"
                disabled={code.length != 19}
              />
            </div>
          </div>
        )}
      </div>
    </FormWrapper>
  );
};

export default AppCodeForm;
