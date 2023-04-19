import React, { useState } from "react";

import { UserCredential } from "firebase/auth";

import { ResultDisplay } from "@@types/common";
import { FormWrapper, InputWritten, FormButton, Validator } from "@@components/FormElements";
import { saveNewUserInDB } from "@@services/firebase/api/usersAPI";
import { registerAuthUserInFirebase } from "@@services/firebase/api/authAPI";
import ResultDisplayer from "@@components/FormElements/ResultDisplayer";

const RegisterForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);

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
      registerAuthUserInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          saveNewUserInDB(result.user);
        } else {
          setmessage({ text: `Something went wrong while creating user: ${result.message}`, isError: true });
        }
      });
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
      <FormWrapper
        title="Register"
        styles="w-[650px]">
        <InputWritten
          required
          type="email"
          name="email"
          onChange={(val) => setemail(val)}
          label="Email"
          value={email}
        />
        <InputWritten
          required
          type="password"
          name="password"
          onChange={(val) => setpassword(val)}
          label="Password"
          hint={Validator.passwordHint()}
          value={password}
        />
        <InputWritten
          required
          type="password"
          name="confirmPassword"
          onChange={(val) => setconfirmPassword(val)}
          label="Confirm Password"
          value={confirmPassword}
        />

        <ResultDisplayer message={message} />

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
        </div>
      </FormWrapper>
    </>
  );
};

export default RegisterForm;
