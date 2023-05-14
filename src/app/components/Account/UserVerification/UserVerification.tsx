import { useState, useRef, useEffect } from "react";
import { User as FirebaseAuthUser } from "firebase/auth";

import { ResultDisplayer } from "@@components/forms";
import { Button } from "@@components/common";
import { AuthAPI } from "@@api/firebase";
import { CommonTypes } from "@@types";
import { useUserValue } from "@@contexts";

const UserVerification: React.FC<{ firebaseUser: FirebaseAuthUser | null | undefined }> = ({ firebaseUser }) => {
  const { user } = useUserValue();
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);
  const [wait, setwait] = useState(0);

  const verifEmailsAmount = useRef(user?.authentication?.verifEmailsAmount);

  useEffect(() => {
    setTimeout(() => {
      determineResendingVerification();
    }, 500);
  }, [firebaseUser, wait]);

  useEffect(() => {
    if (wait) {
      let timeleft = wait;
      let timer = setInterval(function () {
        timeleft--;
        setwait(timeleft);
        if (timeleft <= 0) {
          setwait(0);
          clearInterval(timer);
        }
      }, 1000);
    }
  }, [wait]);

  const determineResendingVerification = (resendRequest?: boolean) => {
    if (firebaseUser && firebaseUser.emailVerified === false && !wait && verifEmailsAmount.current !== undefined) {
      switch (verifEmailsAmount.current) {
        case 0: {
          const msg: CommonTypes.ResultDisplay = {
            text: `You are registered but not verified. Verification email has been sent right now - 
            please check your mail box. If you haven't gotten it, you can try resending it.`,
            isError: true,
          };
          setmessage(msg);
          break;
        }

        default: {
          const msg: CommonTypes.ResultDisplay = {
            text: `You are registered but not verified. Verification email has been already sent to you - 
            please check your mail box. If you haven't gotten it, you can try resending it.`,
            isError: true,
          };
          setmessage(msg);
          if (resendRequest) {
            sendEmail({
              text: `Verification email has been resent.`,
              isError: true,
            });
          }
          break;
        }
      }
    }
  };

  const sendEmail = (successMessage: CommonTypes.ResultDisplay) => {
    if (verifEmailsAmount.current !== undefined && firebaseUser) {
      AuthAPI.sendVerificationEmail((result: Error | void) => {
        sendEmailEffect(result, successMessage);
      }, verifEmailsAmount.current);
    }
  };

  const sendEmailEffect = (result: Error | void, successMessage: CommonTypes.ResultDisplay) => {
    if (!(result instanceof Error)) {
      if (user && user.authentication && verifEmailsAmount.current !== undefined) {
        setmessage(successMessage);
      }
    } else {
      setmessage({
        text: `Something went wrong while sending verificationDetails email: ${result.message}`,
        isError: true,
      });
    }
  };

  const resend = async () => determineResendingVerification(true);

  return (
    <div className="  rounded-md shadow-lg  flex flex-col bg-white py-3 px-5 w-[630px] h-[136px]  border-4 border-red-700  ">
      <ResultDisplayer
        message={message}
        tailwindStyles="text-[15px]  leading-[2]"
      />
      <div className="app_flex_center flex-col">
        <Button
          clickFn={() => resend()}
          formStyle="primary"
          label="Resend email"
        />
      </div>
    </div>
  );
};

export default UserVerification;
