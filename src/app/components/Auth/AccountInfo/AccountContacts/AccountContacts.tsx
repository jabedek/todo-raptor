import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

import Button from "@@components/common/Button";
import { usePopupContext } from "@@components/Layout";
import { UserTypes, InvitationTypes } from "@@types";
import { InvitationsAPI, UsersAPI } from "@@api/firebase";
import InvitationItem from "../InvitationItem/InvitationItem";
import InvitationForm from "../InvitationForm/InvitationForm";

const AccountContacts: React.FC<{ user: UserTypes.User | undefined }> = ({ user }) => {
  const [contacts, setcontacts] = useState<UserTypes.User[]>([]);
  const [invitesSent, setinvitesSent] = useState<InvitationTypes.ContactInvitation[]>([]);
  const [invitesReceived, setinvitesReceived] = useState<InvitationTypes.ContactInvitation[]>([]);

  const { showPopup, popupElement } = usePopupContext();
  const popupInvitation = () => showPopup(<InvitationForm />);
  const deleteContact = (contact: UserTypes.User) => {
    if (contact.authentication.id && user?.authentication.id) {
      InvitationsAPI.usersContactBond(contact.authentication.id, user?.authentication.id, "break").fireAndForget();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const currentUserId = user?.authentication?.id;
      const contactsIds = user?.contacts?.contactsIds;

      // 1. Fetch Contacts
      if (contactsIds?.length) {
        UsersAPI.getUsersById(currentUserId, contactsIds).then((users) => {
          setcontacts(users || []);
        });
      } else {
        setcontacts([]);
      }

      // 2. Fetch Invitations and split
      InvitationsAPI.getCurrentUserPendingContactInvicationsByIds().then((invitations) => {
        if (invitations) {
          const sent: InvitationTypes.ContactInvitation[] = [];
          const received: InvitationTypes.ContactInvitation[] = [];

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
                <p>{contact.authentication.email}</p>
                <p>
                  <MdClose
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
        <p className="flex items-center justify-between h-[30px] ">Invitations you sent</p>
        <ul className="h-[120px] border rounded-[3px] overflow-y-scroll">
          {invitesSent.map((i, index) => (
            <li key={index}>
              <InvitationItem
                invitation={i}
                perspectiveOf="receiver"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col w-full h-[150px]">
        <p className="flex items-center justify-between h-[30px] ">Invitations from other users</p>
        <ul className="h-[120px] border rounded-[3px] overflow-y-scroll">
          {invitesReceived.map((i, index) => (
            <li key={index}>
              <InvitationItem
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
