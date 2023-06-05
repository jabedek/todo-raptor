import { generateDocumentId } from "frotsi";
import { useState } from "react";

import { ContactsAPI, UsersAPI } from "@@api/firebase";
import { ContactInvitation, UserFieldUpdate } from "@@types";
import { useUserValue } from "@@contexts";
import { FormWrapper, InputWritten, ResultDisplay, ResultDisplayer, WrittenChangeEvent } from "@@components/forms";
import { Button } from "@@components/common";

export const ContactForm: React.FC = () => {
  const { user } = useUserValue();
  const [email, setemail] = useState("");
  const [message, setmessage] = useState<ResultDisplay>();

  const handleSubmit = (): void => {
    if (email === user?.authentication.email) {
      setmessage({ isError: true, text: "Can't invite yourself." });
      return;
    }

    setmessage({ isError: false, text: "Sending..." });
    UsersAPI.getUserDetailsByEmail(email)
      .then((receiver) => {
        if (user?.authentication.id && receiver?.authentication.id) {
          const areContacts1 = user?.contacts.contactsIds.includes(receiver?.authentication.id);
          const areContacts0 = receiver?.contacts.contactsIds.includes(user.authentication.id);

          if (areContacts0 && areContacts1) {
            setmessage({ isError: true, text: "Already contacts." });
            return;
          }
        }

        const receiverId = receiver?.authentication.id;
        const receiverEmail = receiver?.authentication.email;

        const senderId = user?.authentication?.id;
        const senderEmail = user?.authentication?.email;

        if (receiverId && senderId && receiverEmail && senderEmail && user) {
          ContactsAPI.getExistingInvitationsBySubjects(receiverId, senderId)
            .then((invitations) => {
              if (invitations && !invitations.length) {
                const newId = `invi_${generateDocumentId()}`;
                const invitation: ContactInvitation = {
                  id: newId,
                  sender: { id: senderId, email: senderEmail },
                  receiver: {
                    id: receiverId,
                    email: receiverEmail,
                  },
                  status: "pending",
                  sentAt: new Date().toISOString(),
                };

                ContactsAPI.saveNewInvitation(invitation).then(
                  () => {
                    const fieldToUpdateCurrentUser: UserFieldUpdate[] = [
                      {
                        fieldPath: "contacts.invitationsIds",
                        value: [...(user.contacts.invitationsIds || []), newId],
                      },
                    ];
                    const fieldToUpdateSubject: UserFieldUpdate[] = [
                      {
                        fieldPath: "contacts.invitationsIds",
                        value: [...(receiver.contacts.invitationsIds || []), newId],
                      },
                    ];

                    const usersSaving = [
                      UsersAPI.updateUserFieldsById(user.authentication.id, fieldToUpdateCurrentUser),
                      UsersAPI.updateUserFieldsById(receiver.authentication.id, fieldToUpdateSubject),
                    ];

                    Promise.all(usersSaving).then(
                      () => {
                        setmessage({ text: "Invitation has been sent.", isError: false });
                      },
                      (err) => {
                        setmessage({ text: err, isError: true });
                      }
                    );
                  },
                  (er) => setmessage({ text: er, isError: true })
                );
              } else {
                setmessage({ text: "Active invitation between you and the contact already exists.", isError: true });
              }
            })
            .catch((e) => console.error(e));
        } else {
          setmessage({ text: "Could not find contact.", isError: true });
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <FormWrapper
      title="Adding contact"
      submitFn={handleSubmit}
      tailwindStyles="w-[500px]">
      <InputWritten
        required
        type="email"
        name="contact-email"
        changeFn={(event: WrittenChangeEvent, val: string) => setemail(val)}
        label="Contact email"
        value={email}
        tailwindStyles="min-w-[250px] w-full"
      />

      <ResultDisplayer message={message} />

      <Button
        formStyle="primary"
        tailwindStyles="mt-8"
        clickFn={handleSubmit}>
        Submit
      </Button>
    </FormWrapper>
  );
};
