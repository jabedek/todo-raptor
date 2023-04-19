import { useState, useContext } from "react";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@@context/AuthContext";
import { firebaseAuth } from "@@services/firebase/firebase-config";
import { ResultDisplay } from "@@types/common";
import { FormWrapper, InputWritten, FormButton, Validator } from "@@components/FormElements";
import { authenticateInFirebase } from "@@services/firebase/api/authAPI";
import ResultDisplayer from "@@components/FormElements/ResultDisplayer";

const LoginForm: React.FC = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const { putAuth } = useContext(AuthContext);
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

  const loginUser = async () => {
    const { isValid, message } = validateForm(email, password);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      authenticateInFirebase(email, password, (result: UserCredential | Error) => {
        if (!(result instanceof Error)) {
          /* Further behavior (setting in context, routing to '/account', etc. ) is in AuthContext.tsx */
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
    <>
      <FormWrapper
        title="Login"
        styles="w-[650px]">
        <InputWritten
          required
          type="email"
          name="email"
          onChange={(val) => setemail(val)}
          label="Email"
          value={email}
          autoComplete="on"
        />
        <InputWritten
          required
          type="password"
          name="password"
          onChange={(val) => setpassword(val)}
          label="Password"
          value={password}
          autoComplete="on"
        />

        <ResultDisplayer message={message} />

        <div className="w-full flex justify-evenly ">
          <FormButton
            action={loginUser}
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

export default LoginForm;
