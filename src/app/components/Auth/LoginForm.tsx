import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCredential } from "firebase/auth";

import { CommonTypes } from "@@types";
import { AuthAPI } from "@@api/firebase";
import { FormWrapper, InputWritten, FormButton, Validator, ResultDisplayer } from "@@components//forms";

const LoginForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);
  const navigate = useNavigate();

  const validateForm = (email: string, password: string) => {
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

    if (!password) {
      isValid = false;
      message += "Password not provided. ";
      return { isValid, message };
    }

    if (!passwordPatternValid) {
      isValid = false;
      message += "Wrong password pattern. ";
    }

    return { isValid, message: isValid ? "Credentials are error-free. Sending..." : message };
  };

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
      />
      <InputWritten
        required
        type="password"
        name="password"
        changeFn={(val) => setpassword(val)}
        label="Password"
        value={password}
        autoComplete="on"
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
  );
};

export default LoginForm;
