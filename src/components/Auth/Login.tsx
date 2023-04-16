import { useState } from "react";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "@@services/firebase";
import { ResultDisplay } from "@@types/common";
import { FormWrapper, InputWritten, FormButton, Validator } from "@@components/FormElements";

const Login: React.FC = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);
  const [user, setuser] = useState<User | undefined>(undefined);

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

  const login = async () => {
    const { isValid, message } = validateForm(email, password);

    setmessage({ text: message, isError: !isValid });
    if (!!isValid) {
      createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (result) => {
          setuser(result.user);
          addNewUserToData(result.user);
          sendEmailVerification(result.user).then(
            (res) => {
              reset();
              setmessage({ text: `User has been registered and verification email has been sent.`, isError: false });
              setTimeout(() => {}, 1000 * 60);
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
      setuser(undefined);
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
            action={login}
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
