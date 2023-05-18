import { useEffect, useState } from "react";
import { usePopupContext } from "@@components/Layout";
import { UserTypes, ContactsTypes } from "@@types";
import { ContactsAPI, UsersAPI } from "@@api/firebase";
import { Button } from "@@components/common";
import { ReactIcons } from "@@components/Layout/preloaded-icons";
import ContactForm from "../ContactForm/ContactForm";
import ContactItem from "../ContactItem/ContactItem";

const AccountContacts: React.FC<{ user: UserTypes.User | undefined; contacts: ContactsTypes.Contact[] }> = ({
  user,
  contacts,
}) => {
  // const [userContacts, setuserContacts] = useState<ContactsTypes.Contact[]>(contacts);
  const [invitesSent, setinvitesSent] = useState<ContactsTypes.ContactInvitation[]>([]);
  const [invitesReceived, setinvitesReceived] = useState<ContactsTypes.ContactInvitation[]>([]);

  const { showPopup, popupElement } = usePopupContext();
  const popupInvitation = () => showPopup(<ContactForm />);
  const deleteContact = (contact: ContactsTypes.Contact) => {
    if (contact.id && user?.authentication.id) {
      ContactsAPI.updateContactsBond(contact.id, user?.authentication.id, "break").fireAndForget();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const currentUserId = user?.authentication?.id;

      // // 1. Fetch Contacts
      // if (contactsIds?.length) {
      //   UsersAPI.getUsersById(contactsIds).then((users) => {
      //     setuserContacts(users || []);
      //   });
      // } else {
      //   setuserContacts([]);
      // }

      // 2. Fetch Invitations and split
      ContactsAPI.getCurrentUserPendingContactInvicationsByIds().then((invitations) => {
        if (invitations) {
          const sent: ContactsTypes.ContactInvitation[] = [];
          const received: ContactsTypes.ContactInvitation[] = [];

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
      });
    }, 200);
  }, [user, popupElement]);

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
                  <ReactIcons.MdClose
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

export default AccountContacts;
