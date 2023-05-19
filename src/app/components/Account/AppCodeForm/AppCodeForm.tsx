import { AuthAPI } from "@@api/firebase";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { FormWrapper, InputWritten, ResultDisplayer } from "@@components/forms";
import { useUserValue } from "@@contexts";
import { CommonTypes, UserTypes } from "@@types";
import { CallbackFn } from "frotsi";
import { useEffect, useState } from "react";

type Props = { submitFn: CallbackFn; user: UserTypes.User | undefined; emailVerified: boolean };

const AppCodeForm: React.FC<Props> = (props) => {
  const [messageCode, setmessageCode] = useState<CommonTypes.ResultDisplay>({ isError: false, text: "" });
  const [messageEmail, setmessageEmail] = useState<CommonTypes.ResultDisplay>({ isError: false, text: "" });

  const [code, setcode] = useState("");
  const { hidePopup } = usePopupContext();

  // useEffect(() => {
  //   console.log(firebaseAuthUser?.emailVerified);
  // }, [firebaseAuthUser]);

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

  const submitCallback = (result: { codeValid: boolean; emailVerif: boolean } | Error | void) => {
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
    } else {
      setmessageCode({
        text: `Could not send a code.`,
        isError: true,
      });
    }
  };

  return (
    <FormWrapper
      title=""
      tailwindStyles="w-[500px] h-[200px]">
      <div className=" flex flex-col font-app_primary ">
        <p className="text-[16px] font-bold w-full text-center mb-2">To use this app fully:</p>
        {!props.emailVerified && (
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
        <ResultDisplayer
          message={messageCode}
          tailwindStyles=" whitespace-break-spaces"
        />
      </div>

      <Button
        clickFn={() => props.submitFn(code, submitCallback)}
        label="Submit"
        formStyle="primary"
        disabled={code.length != 19}
      />
    </FormWrapper>
  );
};

export default AppCodeForm;
