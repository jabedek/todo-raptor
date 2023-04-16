import { useState, useContext } from "react";
import { User as FirebaseUser, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@@context/AuthContext";
import { firebaseAuth, firebaseDB } from "@@services/firebase/firebase-config";
import { ResultDisplay } from "@@types/common";
import { FormWrapper, InputWritten, FormButton, Validator } from "@@components/FormElements";
import { User } from "@@types/User";

const Login: React.FC = () => {
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
      signInWithEmailAndPassword(firebaseAuth, email, password).then(
        (result) => {
          console.log(result);

          const appUser: User = {
            uid: result.user?.uid,
            email: result.user?.email,
            displayName: result.user?.displayName,
            firebaseData: result.user,
          };

          putAuth(appUser);
          navigate("/account", { relative: "route" });
        },
        (error: Error) => {
          setmessage({ text: `Something went wrong while authenticating user: ${error.message}`, isError: true });
          console.error(error);
        }
      );
    }
  };

  const reset = () => {
    setemail("");
    setpassword("");
    setmessage(undefined);
  };

  return (
    <>
      <FormWrapper title="Login">
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
          value={password}
        />

        <p
          className={`h-[45px] transition-all duration-200 italic py-3 text-sm overflow-x-auto ${
            message && message?.isError ? "text-red-500" : "text-green-500"
          }`}>
          {message?.text}
        </p>

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

export default Login;
