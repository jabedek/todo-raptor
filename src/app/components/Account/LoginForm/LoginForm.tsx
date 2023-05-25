import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";

import { AuthAPI } from "@@api/firebase";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer } from "@@components/forms";
import { Button } from "@@components/common";
import { getHint, validateEmailPassword, validateInput } from "@@components/forms/simple-validation";
import { WrittenChangeEvent } from "@@components/forms/components/basic-inputs/types";

const LoginForm: React.FC = () => {
  type FormValidity = keyof typeof validity;
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const [validity, setvalidity] = useState({ password: false, confirmPassword: false, email: false });
  const navigate = useNavigate();

  const handleChange = (formPart: FormValidity, validation: "password" | "email", value: string): void => {
    const newState = {
      ...validity,
      ...{
        [formPart]: validateInput(validation, value),
      },
    };
    setvalidity(newState);
  };

  const handleSubmit = (): void => {
    const { isValid, message } = validateEmailPassword(email, password);

    setmessage({ text: message, isError: !isValid });
    if (isValid) {
      AuthAPI.authenticateInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          setTimeout(() => navigate("/account", { relative: "route" }), 200);
        } else {
          setmessage({ text: `Something went wrong while authenticating user: ${result.message}`, isError: true });
        }
      }).catch((e) => console.error(e));
    }
  };

  const reset = (): void => {
    setemail("");
    setpassword("");
    setmessage(undefined);
  };

  return (
    <FormWrapper
      title="Login"
      submitFn={handleSubmit}
      tailwindStyles="w-[600px]">
      <InputWritten
        required
        type="email"
        name="email"
        invalid={!validity.email}
        changeFn={(event: WrittenChangeEvent, val: string) => {
          setemail(() => {
            handleChange("email", "email", val);
            return val;
          });
        }}
        label="Email"
        value={email}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />
      <InputWritten
        required
        type="password"
        name="password"
        hint={getHint("password")}
        invalid={!validity.password}
        changeFn={(event: WrittenChangeEvent, val: string) => {
          setpassword(() => {
            handleChange("password", "password", val);
            return val;
          });
        }}
        label="Password"
        value={password}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
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
  );
};

export default LoginForm;
