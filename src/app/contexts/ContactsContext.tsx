import { ContactsAPI } from "@@api/firebase";
import { Contact } from "@@types";
import { Unsubscribe } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserValue } from "./UserContext";

type ContactsDataContextType = {
  contacts: Contact[];
  clearContacts: () => void;
};

const ContactsDataContext = createContext<ContactsDataContextType>({
  contacts: [],
  clearContacts: () => {},
});

let UNSUB_CONTACTS: Unsubscribe | undefined = undefined;

const ContactsProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [contacts, setcontacts] = useState<Contact[]>([]);

  const { user } = useUserValue();

  useEffect(() => {
    unsubListener();
    if (user && user.contacts.contactsIds.length) {
      ContactsAPI.listenToUserContactsData(user, (data: Contact[] | undefined, unsubFn: Unsubscribe | undefined) => {
        if (data && unsubFn) {
          setcontacts(data);
          UNSUB_CONTACTS = unsubFn;
        }
      }).catch((e) => console.error(e));
    } else {
      clearContacts();
    }

    return () => unsubListener();
  }, [user?.contacts.contactsIds]);

  const unsubListener = (): void => {
    if (UNSUB_CONTACTS) {
      UNSUB_CONTACTS();
      UNSUB_CONTACTS = undefined;
    }
  };

  const clearContacts = (): void => setcontacts([]);

  return <ContactsDataContext.Provider value={{ contacts, clearContacts }}>{children}</ContactsDataContext.Provider>;
};

function useContactsValue(): ContactsDataContextType {
  return useContext(ContactsDataContext);
}

export { ContactsProvider, useContactsValue };
