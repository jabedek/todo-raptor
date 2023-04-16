import React, { useState } from "react";

import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "@@services/firebase/firebase-config";

import { ResultDisplay } from "@@types/common";
import { FormWrapper, InputWritten, FormButton, Validator } from "@@components/FormElements";

const Register: React.FC = () => {
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const [user, setuser] = useState<User | undefined>(undefined);
  const [resendDisabled, setresendDisabled] = useState(true);

  const validateForm = (email: string, password: string, confirmPassword: string) => {
    let isValid = true;
    let message = "";
    const { validity: emailPatternValid, partialResults: emailResults } = Validator.email(email);
    const { validity: passwordPatternValid, partialResults: passwordResults } = Validator.password(password);

    if (!email) {
      isValid = false;
      message += "Email not provided. ";
      return { isValid, message };
    }

    if (!emailPatternValid) {
      isValid = false;
      message += "Wrong email pattern. ";
    }

    if (!(password && confirmPassword)) {
      isValid = false;
      message += "Password not provided. ";
      return { isValid, message };
    } else if (password !== confirmPassword) {
      isValid = false;
      message += "Passwords does not match. ";
      return { isValid, message };
    }

    if (!passwordPatternValid) {
      isValid = false;
      message += "Wrong password pattern. ";
    }

    return { isValid, message: isValid ? "Credentials are error-free. Sending..." : message };
  };

  const register = async () => {
    const { isValid, message } = validateForm(email, password, confirmPassword);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (result) => {
          setuser(result.user);
          addNewUserToData(result.user);
          sendEmailVerification(result.user).then(
            (res) => {
              reset();
              setmessage({
                text: `User has been registered and verification email has been sent. If you haven't gotten it, you can try resending it in 1 minute.`,
                isError: false,
              });
              setTimeout(() => {
                setresendDisabled(false);
              }, 1000 * 60);
            },
            (error: Error) => {
              setmessage({
                text: `Something went wrong while sending verification email: ${error.message}`,
                isError: true,
              });
              console.error(error);
            }
          );
        },
        (error: Error) => {
          setmessage({ text: `Something went wrong while creating user: ${error.message}`, isError: true });
          console.error(error);
        }
      );
    }
  };

  const addNewUserToData = async (user: User) => {
    setDoc(doc(firebaseDB, "users", user.uid), {
      email: user.email,
      joinedAt: new Date().toISOString(),
    }).then(
      (r) => console.log(r),
      (error) => console.log(error)
    );
  };

  const resend = async () => {
    if (user) {
      sendEmailVerification(user);
      setmessage({ text: `Verification email has been resent.`, isError: false });
      setresendDisabled(true);
      setuser(undefined);
    }
  };

  const reset = () => {
    setemail("");
    setpassword("");
    setconfirmPassword("");
    setmessage(undefined);
  };

  return (
    <>
      <FormWrapper title="Register">
        <InputWritten
          type="email"
          name="email"
          onChange={(e) => setemail(e.target.value)}
          label="Email"
          value={email}
        />
        <InputWritten
          type="password"
          name="password"
          onChange={(e) => setpassword(e.target.value)}
          label="Password"
          hint={Validator.passwordHint()}
          value={password}
        />
        <InputWritten
          type="password"
          name="confirmPassword"
          onChange={(e) => setconfirmPassword(e.target.value)}
          label="Confirm Password"
          value={confirmPassword}
        />

        <p
          className={`h-[45px] transition-all duration-200 italic py-3 text-sm overflow-x-auto ${
            message && message?.isError ? "text-red-500" : "text-green-500"
          }`}>
          {message?.text}
        </p>

        <div className="w-full flex justify-evenly ">
          <FormButton
            action={register}
            style="primary"
            label="Submit"
          />
          <FormButton
            action={reset}
            style="secondary"
            label="Reset"
          />
          <FormButton
            action={resend}
            style="secondary"
            label="Resend email"
            disabled={resendDisabled}
          />
        </div>
      </FormWrapper>
    </>
  );
};

export default Register;
