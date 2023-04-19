import { FormButton } from "@@components/FormElements";
import { User as FirebaseAuthUser } from "firebase/auth";
import ResultDisplayer from "@@components/FormElements/ResultDisplayer";
import { User } from "@@types/User";
import { ResultDisplay } from "@@types/common";
import { sendEmailVerification } from "firebase/auth";
import { useState, useRef, MutableRefObject, useEffect, useContext } from "react";
import { useAuthValue } from "@@context/AuthContext";
import { sendVerificationEmail } from "@@services/firebase/api/authAPI";
import { updateUserDetails } from "@@services/firebase/api/usersAPI";
import { roundPreciseFn } from "frotsi/dist/utils/utils.index";

const UserVerification: React.FC<{ firebaseUser: FirebaseAuthUser | null }> = ({ firebaseUser }) => {
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const { user } = useAuthValue();
  const [canResend, setcanResend] = useState(false);
  const [lastVerifEmailAt, setlastVerifEmailAt] = useState(user?.verification?.lastVerifEmailAt);
  const [wait, setwait] = useState(0);

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

  useEffect(() => {
    if (lastVerifEmailAt) {
      const date = new Date(lastVerifEmailAt);
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

    checkVerification();
  }, [user, lastVerifEmailAt]);

  const checkVerification = () => {
    if (firebaseUser && firebaseUser.emailVerified === false && user) {
      const verifEmailsAmount = Number(user.verification?.lastVerifEmailAt);

      if (verifEmailsAmount === 0) {
        sendVerificationEmail(firebaseUser, (result: Error | void) => {
          if (!(result instanceof Error)) {
            updateUserVerificationDetails();
            setmessage({
              text: ` You are registered but not verified. \nVerification email has been sent right now - please check your mail box.\nIf you haven't gotten it, you can try resending it in 1 minute.`,
              isError: true,
            });
          } else {
            setmessage({
              text: `Something went wrong while sending verification email: ${result.message}`,
              isError: true,
            });
          }
        });
      }

      if (verifEmailsAmount > 0) {
        setmessage({
          text: ` You are registered but not verified. \nVerification email has been already sent to you - please check your mail box.\nIf you haven't gotten it, you can try resending it soon (up to 1 minute).`,
          isError: true,
        });
      }
    }
  };

  const updateUserVerificationDetails = async () => {
    if (user) {
      const { verification } = user;

      const date = new Date().toISOString();
      setlastVerifEmailAt(date);

      const newVerif: typeof user.verification = {
        lastVerifEmailAt: date,
        verifEmailsAmount: (verification?.verifEmailsAmount || 0) + 1,
      };
      console.log(user, newVerif);

      updateUserDetails({ ...user, verification: newVerif }).then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const resend = async () => {
    console.log(firebaseUser);

    sendVerificationEmail(firebaseUser, (result: Error | void) => {
      if (!(result instanceof Error)) {
        setcanResend(false);
        updateUserVerificationDetails();
        setmessage({ text: `Verification email has been resent.`, isError: true });
      } else {
        setmessage({
          text: `Something went wrong while sending verification email: ${result.message}`,
          isError: true,
        });
      }
    });
  };

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
