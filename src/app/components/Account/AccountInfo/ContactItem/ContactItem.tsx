import { memo, useEffect, useState } from "react";

import { ContactInvitation } from "@@types";
import { ContactsAPI } from "@@api/firebase";
import "./ContactItem.scss";
import { DateFormats, DateFormatter } from "@@utils/date-formatter";
import { Icons } from "@@components/Layout";

type Props = { invitation: ContactInvitation; perspectiveOf: "sender" | "receiver" };

const ContactItemComponent: React.FC<Props> = ({ invitation, perspectiveOf }) => {
  const date = DateFormatter.formatToString(new Date().toISOString(), DateFormats["YYYY-MM-DD"]);
  const [subject, setSubject] = useState<{ status: string; message: string }>();

  useEffect(() => {
    let message = "";
    if (perspectiveOf === "sender") {
      message = `You received invitation from \n${invitation.sender.email}.`;
    } else {
      message = `You sent invitation to \n${invitation.receiver.email}.`;
    }

    setSubject({ status: invitation.status, message });
  }, [invitation, perspectiveOf]);

  const handleSubmit = (variant: "accept" | "reject"): void => {
    const updatedInv: ContactInvitation = { ...invitation };

    switch (variant) {
      case "accept":
        updatedInv.status = "accepted";
        break;
      case "reject":
        updatedInv.status = "rejected";
        break;
    }

    ContactsAPI.removePendingInvitation(updatedInv).then(
      () => {
        if (variant === "accept") {
          ContactsAPI.updateContactsBond(invitation.receiver.id, invitation.sender.id, "make").then(
            () => {},
            (er) => console.error("Error while updating users' contacts. " + er)
          );
        }
      },
      (err) => console.error("Error while updating Contact Invitation object. " + err)
    );
  };

  return (
    <div className="flex items-center text-sm py-2 h-[64px] px-3 w-full border-b border-gray-100 justify-between">
      <div className="flex flex-col font-[400] text-[11px] whitespace-pre min-w-[80px] ">
        <p className="font-app_mono ">{date}</p>
        <p className={`font-app_primary font-[700] uppercase contact-status-${subject?.status}`}>{subject?.status}</p>
      </div>
      <div className="flex Xflex-col items-center justify-evenly w-[64px] h-fit ">
        {perspectiveOf === "sender" && (
          <Icons.MdCheck
            onClick={() => handleSubmit("accept")}
            className="invitation-action cursor-pointer text-white rounded-[2px] bg-green-700 hover:bg-green-600"
          />
        )}
        <Icons.MdClose
          onClick={() => handleSubmit("reject")}
          className="invitation-action cursor-pointer text-white rounded-[2px] bg-red-700 hover:bg-red-600 "
        />
      </div>
      <p className="flex text-right text-[11px] w-fit">{subject?.message}</p>
    </div>
  );
};

export const ContactItem = memo(ContactItemComponent, (oldProps, newProps) => {
  const { id: oldId, status: oldStatus } = oldProps.invitation;
  const { id: newId, status: newStatus } = newProps.invitation;
  return oldId === newId && oldStatus === newStatus;
});
