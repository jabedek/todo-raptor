import { FormButton } from "@@components/FormElements";
import { User as FirebaseAuthUser } from "firebase/auth";
import ResultDisplayer from "@@components/FormElements/ResultDisplayer";
import { User } from "@@types/User";
import { ResultDisplay } from "@@types/common";
import { useState, useRef, MutableRefObject, useEffect, useContext } from "react";
import { useAuthValue } from "@@context/AuthContext";
import { AuthAPI } from "@@services/api/authAPI";
import { UsersAPI } from "@@services/api/usersAPI";
import { roundPreciseFn } from "frotsi/dist/utils/utils.index";

const UserVerification: React.FC<{ firebaseUser: FirebaseAuthUser | null }> = ({ firebaseUser }) => {
  const { user } = useAuthValue();
  const [canResend, setcanResend] = useState(true);
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const [wait, setwait] = useState(0);

  const lastVerifEmailAt = useRef(user?.verificationInfo?.lastVerifEmailAt);
  const verifEmailsAmount = useRef(user?.verificationInfo?.verifEmailsAmount);

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
          const msg: ResultDisplay = {
            text: `You are registered but not verified. \nVerification email has been sent right now - please check your mail box.\nIf you haven't gotten it, you can try resending it.`,
            isError: true,
          };
          setupTimer();
          setmessage(msg);
          break;
        }

        default: {
          const msg: ResultDisplay = {
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

  const sendEmail = (successMessage: ResultDisplay) => {
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

  const sendEmailEffect = (result: Error | void, successMessage: ResultDisplay) => {
    if (!(result instanceof Error)) {
      if (user && user.verificationInfo && verifEmailsAmount.current !== undefined) {
        setmessage(successMessage);
      }
    } else {
      setmessage({
        text: `Something went wrong while sending verificationInfo email: ${result.message}`,
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
          action={() => resend()}
          style="primary"
          label="Resend email"
          disabled={!canResend}
        />
      </div>
    </div>
  );
};

export default UserVerification;
