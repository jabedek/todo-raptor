import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../firebase-config";
import { AppAPICode, AppAPICodes, AppAPINoCodeEmail, AppAPINoCodeEmails } from "../types";
import { isCodeValid, isNoCodeEmailValid } from "../utils";
import { AuthAPI } from "./authAPI";

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

const getFullCodeValidity = async (values: { emailValue: string; codeValue: string }) => {
  const { emailValue, codeValue } = values;
  const noCodeNeeded = await checkDataValidity({ value: emailValue, which: "no-code-emails" });
  if (noCodeNeeded) {
    return true;
  }

  if (!codeValue?.length) {
    return false;
  }

  return await checkDataValidity({ value: codeValue, which: "codes" });
};

const MetadataAPI = {
  getFullCodeValidity,
  checkDataValidity,
};

export { MetadataAPI };
