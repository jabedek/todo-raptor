import { MetadataAPI } from "@@api/firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUserValue } from "./UserContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { StorageItem } from "../types/enums";
import { User as FirebaseAuthUser } from "firebase/auth";

/**
 * * `canAccessAPI` - only true if both `mustProvideCode` and `mustVerifyEmail` are true
 * * `mustProvideCode` - checks if logged user has provided valid code (with exceptions - `no code emails`)
 * * `mustVerifyEmail` - checks if logged user has verified his email after registration (with exceptions - `no code emails`)
 * */
type ApiAccessContextType = {
  canAccessAPI: boolean | undefined;
  shouldPingUser: boolean;
  hasProvided: LackingValidations;
  checkProvidedCode: CheckProvidedCodeFn;
};

export type CheckProvidedCodeFn = (email: string, code: string) => Promise<LackingValidations>;

export type LackingValidations = {
  validAppCode: boolean | undefined;
  verifiedEmail: boolean | undefined;
};

const initValidations: LackingValidations = {
  validAppCode: undefined,
  verifiedEmail: undefined,
};

export const ApiAccessContext = createContext<ApiAccessContextType>({
  canAccessAPI: undefined,
  shouldPingUser: false,
  hasProvided: { ...initValidations },
  /* eslint-disable-next-line */
  checkProvidedCode: (email: string, code: string): Promise<LackingValidations> => new Promise(() => {}),
});

const APIAccessProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [canAccessAPI, setcanAccessAPI] = useState(false);
  const [hasProvided, sethasProvided] = useState<LackingValidations>({ ...initValidations });
  const [shouldPingUser, setshouldPingUser] = useState(false);
  const { user, firebaseAuthUser } = useUserValue();
  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    if (user && firebaseAuthUser) {
      if (!(hasProvided.validAppCode && hasProvided.verifiedEmail)) {
        checkWhatToProvide(firebaseAuthUser);
      }
    }
  }, [user?.authentication.email, user?.authentication.verifEmailsAmount, firebaseAuthUser]);

  useEffect(() => {
    if (hasProvided.validAppCode !== undefined && hasProvided.verifiedEmail !== undefined) {
      const allCorrect = hasProvided.validAppCode && hasProvided.verifiedEmail;
      setcanAccessAPI(allCorrect);
      setshouldPingUser(!allCorrect);
    }
  }, [hasProvided.validAppCode, hasProvided.verifiedEmail]);

  const checkWhatToProvide = (firebaseAuthUser: FirebaseAuthUser): void => {
    checkValidity(firebaseAuthUser).catch((e) => console.error(e));
  };

  const checkValidity = async (firebaseAuthUser: FirebaseAuthUser): Promise<void> => {
    const email = firebaseAuthUser.email;

    if (email) {
      const isNoCodeEmail = await MetadataAPI.checkDataValidity({ value: email, which: "no-code-emails" });

      if (isNoCodeEmail) {
        sethasProvided({ validAppCode: true, verifiedEmail: true });
      } else {
        const code = getItem(StorageItem.CODE) || "";
        const newState = await MetadataAPI.getFullCodeValidity({ emailValue: email, codeValue: code });
        sethasProvided({
          ...newState,
        });

        if (newState.validAppCode) {
          setItemLocalStorage(code);
        }
      }
    }
  };

  const checkProvidedCode = async (email: string, code: string): Promise<LackingValidations> => {
    const newState = await MetadataAPI.getFullCodeValidity({ emailValue: email, codeValue: code });

    if (newState.validAppCode) {
      setItemLocalStorage(code);
    }

    sethasProvided(newState);
    return newState;
  };

  const setItemLocalStorage = (code: string): void => setItem(StorageItem.CODE, code);

  return (
    <ApiAccessContext.Provider value={{ canAccessAPI, shouldPingUser, checkProvidedCode, hasProvided }}>
      {children}
    </ApiAccessContext.Provider>
  );
};

function useApiAccessValue(): ApiAccessContextType {
  return useContext(ApiAccessContext);
}

export { APIAccessProvider, useApiAccessValue };
