import { CallbackFn } from "frotsi";
import { useState } from "react";

import { AuthAPI } from "@@api/firebase";
import { LackingValidations, User } from "@@types";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer, WrittenChangeEvent } from "@@components/forms";

type Props = {
  user: User | undefined;
  neededToVerify: { mustProvideCode: boolean; mustVerifyEmail: boolean };
  checkCode: CallbackFn<Promise<LackingValidations>>;
};

export const AppCodeForm: React.FC<Props> = ({ user, neededToVerify, checkCode }) => {
  const [messageCode, setmessageCode] = useState<ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<ResultDisplay>({ isError: false, text: "" });
  const [code, setcode] = useState("");

  const sendEmail = (): void => {
    if (user) {
      AuthAPI.sendVerificationEmail((result: Error | void) => {
        sendEmailEffect(result);
      }, user?.authentication.verifEmailsAmount).catch((e) => console.error(e));
    }
  };

  const sendEmailEffect = (result: Error | void): void => {
    if (!(result instanceof Error)) {
      if (user?.authentication.verifEmailsAmount) {
        let message = "Email has been re-send. Check your email now and verify it (then refresh the page). ";
        if (neededToVerify.mustProvideCode === false) {
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

  const submit = (): void => {
    if (code) {
      setmessageCode({ text: "", isError: false });
      const email = user?.authentication.email || "";
      checkCode(email, code)
        .then((result: LackingValidations) => {
          if (result.validAppCode) {
            let message = "Code is correct and has been validated. ";
            setcode("");
            if (result.verifiedEmail) {
              message += "You can close this window.";
            }
            setmessageCode({ text: message, isError: false });
          } else {
            setmessageCode({ text: "Code is false.", isError: true });
          }
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] min-h-fit ">
      <div className=" flex flex-col items-center gap-12 w-full justify-between font-app_primary px-1 py-3">
        <p className="py-1 text-[17px] font-app_primary uppercase font-bold">To use this app fully:</p>
        {user && neededToVerify.mustVerifyEmail && (
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

        {neededToVerify.mustProvideCode && (
          <div className="flex-col app_flex_center h-[310px] w-[90%] px-2  bg-gray-100 py-2 rounded-[4px]">
            <p className="app_flex_center  text-center text-[15px] w-full  h-fit font-bold whitespace-pre-line ">
              {`Provide a code below. \nIt should be given to you from a developer`}
            </p>
            <div className="h-[200px] flex-col w-auto app_flex_center">
              <InputWritten
                changeFn={(event: WrittenChangeEvent, val: string) => setcode(val)}
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
