import { doc, getDoc } from "firebase/firestore";
import { FirebaseDB } from "../firebase-config";
import { AppAPICode, AppAPINoCodeEmail } from "../types";
import { isCodeValid, isNoCodeEmailValid } from "../utils";
import { AuthAPI } from "./authAPI";
import { LackingValidations } from "src/app/contexts/ApiAccessContext";

export const CHECK_ACCESS = import.meta.env.VITE_REACT_APP_CHECK_ACCESS === "yes";

export type ApiAccessCheck = {
  value: string;
  which: "no-code-emails" | "codes";
};

const checkDataValidity = async (check: ApiAccessCheck): Promise<boolean> => {
  if (!CHECK_ACCESS) {
    return true;
  }

  let result = false;
  const { value, which } = check;
  if (value.length) {
    const docSnap = await getDoc(doc(FirebaseDB, `metadata.${which}`, value));
    if (!docSnap.exists()) {
      result = false;
    }
    const data = docSnap.data();
    result = which === "codes" ? isCodeValid(data as AppAPICode) : isNoCodeEmailValid(data as AppAPINoCodeEmail);
  }

  return result;
};

const getFullCodeValidity = async (values: {
  emailValue: string;
  codeValue: string | undefined;
}): Promise<LackingValidations> => {
  const { emailValue, codeValue } = values;

  const validity = {
    validAppCode: false,
    verifiedEmail: false,
  };

  const noCodeNeeded = emailValue?.length ? await checkDataValidity({ value: emailValue, which: "no-code-emails" }) : false;
  if (noCodeNeeded) {
    validity.validAppCode = true;
    validity.verifiedEmail = true;
  } else {
    validity.validAppCode = codeValue?.length ? await checkDataValidity({ value: codeValue, which: "codes" }) : false;
    validity.verifiedEmail = !!(await AuthAPI.getCurrentFirebaseAuthUser()?.emailVerified);
  }
  return validity;
};

const MetadataAPI = {
  getFullCodeValidity,
  checkDataValidity,
};

export { MetadataAPI };
