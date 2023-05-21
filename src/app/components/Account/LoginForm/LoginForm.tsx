import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";

import {} from "@@types";
import { AuthAPI } from "@@api/firebase";
import { FormWrapper, InputWritten, ResultDisplayer, ResultDisplay } from "@@components/forms";
import { Button } from "@@components/common";
import { validate, validateEmailPassword } from "@@components/forms/simple-validation";

const LoginForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const navigate = useNavigate();

  const validateForm = (formEmail: string, formPassword: string) => validateEmailPassword(formEmail, formPassword);

  const handleSubmit = async () => {
    const { isValid, message } = validateForm(email, password);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      AuthAPI.authenticateInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          setTimeout(() => navigate("/account", { relative: "route" }), 200);
        } else {
          setmessage({ text: `Something went wrong while authenticating user: ${result.message}`, isError: true });
        }
      });
    }
  };

  const reset = () => {
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
        changeFn={(val) => setemail(val)}
        label="Email"
        value={email}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />
      <InputWritten
        required
        type="password"
        name="password"
        changeFn={(val) => setpassword(val)}
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
