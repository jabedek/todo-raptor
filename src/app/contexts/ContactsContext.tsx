import { ContactsAPI } from "@@api/firebase";
import { ContactsTypes } from "@@types";
import { Unsubscribe } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserValue } from "./UserContext";

type ContactsDataValue = {
  contacts: ContactsTypes.Contact[];
  clearContacts: () => void;
};

const ContactsDataValue = createContext<ContactsDataValue>({
  contacts: [],
  clearContacts: () => {},
});

let UNSUB_CONTACTS: Unsubscribe | undefined = undefined;

const ContactsProvider = ({ children }: any) => {
  const [contacts, setcontacts] = useState<ContactsTypes.Contact[]>([]);

  const { user, canUseAPI } = useUserValue();

  useEffect(() => {
    unsubListener();
    if (user && canUseAPI) {
      ContactsAPI.listenToUserContactsData(user, (data: ContactsTypes.Contact[], unsubFn) => {
        setcontacts(data);
        UNSUB_CONTACTS = unsubFn;
      });
    } else {
      clearContacts();
    }

    return () => unsubListener();
  }, [user]);

  const unsubListener = () => {
    if (UNSUB_CONTACTS) {
      UNSUB_CONTACTS();
      UNSUB_CONTACTS = undefined;
    }
  };

  const clearContacts = () => setcontacts([]);

  return <ContactsDataValue.Provider value={{ contacts, clearContacts }}>{children}</ContactsDataValue.Provider>;
};

function useContactsValue() {
  return useContext(ContactsDataValue);
}

export { ContactsProvider, useContactsValue };
