import React, { useState } from "react";
import { UserCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { UsersAPI, AuthAPI } from "@@api/firebase";
import { FormWrapper, InputWritten, ResultDisplayer, ResultDisplay } from "@@components/forms";
import { Button } from "@@components/common";
import { validateEmailPassword } from "@@components/forms/simple-validation";

const RegisterForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [lastname, setlastname] = useState("");
  const [nickname, setnickname] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const navigate = useNavigate();

  const validateForm = (formEmail: string, formPassword: string, formConfirmPassword: string) =>
    validateEmailPassword(formEmail, formPassword, formConfirmPassword);

  const handleSubmit = async () => {
    const { isValid, message } = validateForm(email, password, confirmPassword);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      AuthAPI.registerAuthUserInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          let displayName = "";
          if (!nickname) {
            if (name[0] && lastname[0]) {
              displayName = `${name[0]}${lastname[0]}`;
            } else {
              displayName = email?.split("@")[0] || "";
            }
          } else {
            displayName = nickname;
          }
          const names = { name, lastname, nickname: displayName };
          UsersAPI.saveNewUserInDB(result.user, names).then(
            () => {
              setTimeout(() => navigate("/account", { relative: "route" }), 200);
              AuthAPI.sendVerificationEmail((res: Error | void) => {}, 0);
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
        tailwindStyles="w-[600px]">
        <InputWritten
          required
          type="email"
          name="email"
          changeFn={(val) => setemail(val)}
          label="Email"
          value={email}
          tailwindStyles="min-w-[250px] w-full"
        />

        <InputWritten
          required
          type="password"
          name="password"
          changeFn={(val) => setpassword(val)}
          label="Password"
          hint={"Validator.passwordHint()"}
          value={password}
          tailwindStyles="min-w-[250px] w-full"
        />

        <InputWritten
          required
          type="password"
          name="confirmPassword"
          changeFn={(val) => setconfirmPassword(val)}
          label="Confirm Password"
          value={confirmPassword}
          tailwindStyles="min-w-[250px] w-full"
        />

        <InputWritten
          changeFn={(e) => setname(e)}
          name="user-name"
          value={name}
          tailwindStyles="min-w-[250px] w-full"
          label="Name"
          type="text"
        />

        <InputWritten
          changeFn={(e) => setlastname(e)}
          name="user-lastname"
          value={lastname}
          tailwindStyles="min-w-[250px] w-full"
          label="Last Name"
          type="text"
        />

        <InputWritten
          changeFn={(e) => setnickname(e)}
          name="user-nickname"
          value={nickname}
          tailwindStyles="min-w-[250px] w-full"
          label="Display Name"
          type="text"
        />

        <ResultDisplayer message={message} />

        <div className="w-full flex justify-evenly ">
          <Button
            clickFn={handleSubmit}
            formStyle="primary"
            label="Submit"
          />

          <Button
            clickFn={reset}
            formStyle="secondary"
            label="Reset"
          />
        </div>
      </FormWrapper>
    </>
  );
};

export default RegisterForm;
