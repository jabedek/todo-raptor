import React, { useState } from "react";
import { UserCredential } from "firebase/auth";

import { CommonTypes } from "@@types";
import { FormWrapper, InputWritten, FormButton, Validator, ResultDisplayer } from "@@components/FormElements";
import { UsersAPI, AuthAPI } from "@@api";

const RegisterForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);

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

  const handleSubmit = async () => {
    const { isValid, message } = validateForm(email, password, confirmPassword);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      AuthAPI.registerAuthUserInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          UsersAPI.saveNewUserInDB(result.user).then(
            () => {
              AuthAPI.sendVerificationEmail(AuthAPI.getCurrentFirebaseAuthUser(), (res: Error | void) => {}, 0);
            },
            () => {}
          );
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
        submitFn={handleSubmit}
        tailwindStyles="w-[500px]">
        <InputWritten
          required
          type="email"
          name="email"
          changeFn={(val) => setemail(val)}
          label="Email"
          value={email}
        />

        <InputWritten
          required
          type="password"
          name="password"
          changeFn={(val) => setpassword(val)}
          label="Password"
          hint={Validator.passwordHint()}
          value={password}
        />

        <InputWritten
          required
          type="password"
          name="confirmPassword"
          changeFn={(val) => setconfirmPassword(val)}
          label="Confirm Password"
          value={confirmPassword}
        />

        <ResultDisplayer message={message} />

        <div className="w-full flex justify-evenly ">
          <FormButton
            clickFn={handleSubmit}
            style="primary"
            label="Submit"
          />

          <FormButton
            clickFn={reset}
            style="secondary"
            label="Reset"
          />
        </div>
      </FormWrapper>
    </>
  );
};

export default RegisterForm;
