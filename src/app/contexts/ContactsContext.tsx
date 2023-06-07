import { createContext, useContext, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import { ContactsAPI } from "@@api/firebase";
import { Contact, User } from "@@types";
import { useUserValue } from "@@contexts";

type ContactsDataContextType = {
  contacts: Contact[];
  clearContacts: () => void;
};

let UNSUB_CONTACTS: Unsubscribe | undefined = undefined;

const ContactsDataContext = createContext<ContactsDataContextType>({
  contacts: [],
  clearContacts: () => {},
});

const ContactsProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [contacts, setcontacts] = useState<Contact[]>([]);

  const { user } = useUserValue();

  useEffect(() => {
    if (user && user.contacts.contactsIds.length) {
      listenToUserContactsData(user);
    } else {
      clearContacts();
    }

    return () => unsubListener();
  }, [user?.contacts.contactsIds]);

  const listenToUserContactsData = (user: User): void => {
    unsubListener();
    ContactsAPI.listenToUserContactsData(user, (data: Contact[] | undefined, unsub: Unsubscribe | undefined) => {
      if (data && unsub) {
        UNSUB_CONTACTS = unsub;
        setcontacts(data);
      }
    }).catch((e) => console.error(e));
  };

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
