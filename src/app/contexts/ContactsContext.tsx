import { createContext, useContext, useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import { ContactsAPI, ListenersHandler } from "@@api/firebase";
import { Contact, User } from "@@types";
import { useUserValue } from "@@contexts";

type ContactsDataContextType = {
  contacts: Contact[];
  clearContacts: () => void;
};

const ContactsDataContext = createContext<ContactsDataContextType>({
  contacts: [],
  clearContacts: () => {},
});

const ContactsProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const Listeners = new ListenersHandler("ContactsProvider");
  const [contacts, setcontacts] = useState<Contact[]>([]);

  const { user } = useUserValue();

  useEffect(() => {
    if (user && user.contacts.contactsIds.length) {
      listenToUserContactsData(user);
    } else {
      clearContacts();
    }

    return () => Listeners.unsubAll();
  }, [user?.contacts.contactsIds]);

  const listenToUserContactsData = (user: User): void => {
    ContactsAPI.listenToUserContactsData(user, (data: Contact[] | undefined, unsubFn: Unsubscribe | undefined) => {
      if (data && unsubFn) {
        Listeners.sub("contacts", unsubFn);
        setcontacts(data);
      }
    }).catch((e) => console.error(e));
  };

  const clearContacts = (): void => setcontacts([]);

  return <ContactsDataContext.Provider value={{ contacts, clearContacts }}>{children}</ContactsDataContext.Provider>;
};

function useContactsValue(): ContactsDataContextType {
  return useContext(ContactsDataContext);
}

export { ContactsProvider, useContactsValue };
