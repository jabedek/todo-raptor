import { useEffect, useState } from "react";

import { Contact, ContactInvitation, User } from "@@types";
import { ContactsAPI } from "@@api/firebase";
import { usePopupContext, Icons } from "@@components/Layout";
import { Button } from "@@components/common";
import { ContactForm, ContactItem } from "@@components/Account";

type Props = { user: User | undefined; contacts: Contact[] };

export const AccountContacts: React.FC<Props> = ({ user, contacts }) => {
  const [invitesSent, setinvitesSent] = useState<ContactInvitation[]>([]);
  const [invitesReceived, setinvitesReceived] = useState<ContactInvitation[]>([]);

  const { showPopup, popupElement } = usePopupContext();
  const popupInvitation = (): void => showPopup(<ContactForm />);
  const deleteContact = (contact: Contact): void => {
    if (contact.id && user?.authentication.id) {
      ContactsAPI.updateContactsBond(contact.id, user?.authentication.id, "break").fireAndForget(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const currentUserId = user?.authentication?.id;

      ContactsAPI.getUserPendingInvitations()
        .then((invitations) => {
          if (invitations) {
            const sent: ContactInvitation[] = [];
            const received: ContactInvitation[] = [];

            invitations.forEach((invite) => {
              if (currentUserId === invite.receiver.id) {
                received.push(invite);
              }

              if (currentUserId === invite.sender.id) {
                sent.push(invite);
              }
            });

            setinvitesSent(sent);
            setinvitesReceived(received);
          }
        })
        .fireAndForget();
    }, 200);
  }, [user, popupElement, contacts]);

  return (
    <>
      <div className="flex flex-col w-full h-[300px]">
        <p className="flex items-center justify-between h-[30px] ">
          Contacts
          <Button
            label="Add contact"
            clickFn={popupInvitation}
            tailwindStyles="ml-2 font-[600] px-2 py-1 bg-app_tertiary rounded-[4px] text-[11px] font-[500] transition-all transition-200 hover:bg-app_tertiary_light"
          />
        </p>

        <ul className="h-[270px] border rounded-[3px] overflow-y-scroll">
          {contacts.map((contact, index) => (
            <li key={index}>
              <div className="flex items-center justify-between p-2 w-full border-b text-md">
                <p>{contact.email}</p>
                <p>
                  <Icons.MdClose
                    onClick={() => deleteContact(contact)}
                    className="cursor-pointer text-white rounded-[2px] bg-red-700 hover:bg-red-600"
                  />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-full h-[150px]">
        <p className="flex items-center justify-between h-[30px] ">Contact invitations you sent</p>
        <ul className="h-[120px] border rounded-[3px] overflow-y-scroll">
          {invitesSent.map((i, index) => (
            <li key={index}>
              <ContactItem
                invitation={i}
                perspectiveOf="receiver"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-full h-[150px]">
        <p className="flex items-center justify-between h-[30px] ">Contact invitations from other users</p>
        <ul className="h-[120px] border rounded-[3px] overflow-y-scroll">
          {invitesReceived.map((i, index) => (
            <li key={index}>
              <ContactItem
                key={index}
                invitation={i}
                perspectiveOf="sender"
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
