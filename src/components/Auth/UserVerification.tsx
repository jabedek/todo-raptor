import { roundPreciseFn } from "frotsi/dist/utils/utils.index";
import { useState, useRef, useEffect } from "react";
import { User as FirebaseAuthUser } from "firebase/auth";

import { ResultDisplayer, FormButton } from "@@components/FormElements";
import { AuthAPI } from "@@api";
import { useAuthDataValue, useUserDataValue } from "@@context";
import { CommonTypes } from "@@types";

const UserVerification: React.FC<{ firebaseUser: FirebaseAuthUser | null }> = ({ firebaseUser }) => {
  const { auth } = useAuthDataValue();
  const { userData } = useUserDataValue();
  const [canResend, setcanResend] = useState(true);
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);
  const [wait, setwait] = useState(0);

  const lastVerifEmailAt = useRef(userData?.verificationDetails?.lastVerifEmailAt);
  const verifEmailsAmount = useRef(userData?.verificationDetails?.verifEmailsAmount);

  useEffect(() => {
    setTimeout(() => {
      determineResendingVerification();
    }, 500);
  }, []);

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
            text: `You are registered but not verified. \nVerification email has been sent right now - please check your mail box.\nIf you haven't gotten it, you can try resending it.`,
            isError: true,
          };
          setupTimer();
          setmessage(msg);
          break;
        }

        default: {
          const msg: CommonTypes.ResultDisplay = {
            text: `You are registered but not verified. Verification email has been already sent to you - please check your mail box.
            \nIf you haven't gotten it, you can try resending it.`,
            isError: true,
          };
          setmessage(msg);
          if (resendRequest) {
            sendEmail({
              text: `Verification email has been resent.`,
              isError: true,
            });
            setupTimer();
          }
          break;
        }
      }
    }
  };

  const sendEmail = (successMessage: CommonTypes.ResultDisplay) => {
    if (verifEmailsAmount.current !== undefined) {
      AuthAPI.sendVerificationEmail(
        firebaseUser,
        (result: Error | void) => {
          sendEmailEffect(result, successMessage);
        },
        verifEmailsAmount.current
      );
    }
  };

  const sendEmailEffect = (result: Error | void, successMessage: CommonTypes.ResultDisplay) => {
    if (!(result instanceof Error)) {
      if (userData && userData.verificationDetails && verifEmailsAmount.current !== undefined) {
        setmessage(successMessage);
      }
    } else {
      setmessage({
        text: `Something went wrong while sending verificationDetails email: ${result.message}`,
        isError: true,
      });
    }
  };

  const setupTimer = () => {
    if (lastVerifEmailAt.current !== undefined) {
      const date = new Date(lastVerifEmailAt.current);
      const newDate = new Date(date.getTime() + 1 * 60000);
      const now = new Date();
      const secondsDiff = Math.abs(newDate.getTime() / 1000 - now.getTime() / 1000);
      const secondsTrimmed = roundPreciseFn(secondsDiff, "up", 0);
      const fullSeconds = secondsTrimmed <= 60 ? secondsTrimmed : 0;
      setmessage({
        text: ` You are registered but not verified. Verification email has been already sent to you - please check your mail box.
            \nIf you haven't gotten it, you can try resending it.`,
        isError: true,
      });

      setwait(fullSeconds);

      setTimeout(() => {
        setcanResend(true);
      }, fullSeconds * 1000);
    } else {
      setcanResend(true);
    }
  };

  const resend = async () => determineResendingVerification(true);

  return (
    <div className="  rounded-md shadow-lg   bg-white py-3 px-5 w-[630px]  border-4 border-red-700  ">
      <ResultDisplayer
        message={message}
        tailwindStyles="text-[15px]  leading-[2]"
      />
      <div className="app_flex_center flex-col">
        <div className="h-[30px] text-sm">
          {!canResend && wait > 0 && "Wait to next resend: "}
          {!canResend && wait > 0 && <span className="font-app_mono">{wait}</span>}
          {!canResend && wait > 0 && " seconds."}
        </div>
        <FormButton
          clickFn={() => resend()}
          style="primary"
          label="Resend email"
          disabled={!canResend}
        />
      </div>
    </div>
  );
};

export default UserVerification;
