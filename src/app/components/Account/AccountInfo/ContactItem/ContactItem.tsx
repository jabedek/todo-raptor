import { useState, useEffect } from "react";

import "./ContactItem.scss";
import { ContactsTypes } from "@@types";
import { DateFormatter, DateFormats } from "@@utils/date-formatter";
import { ContactsAPI } from "@@api/firebase";
import { ReactIcons } from "@@components/Layout/preloaded-icons";

const ContactItem: React.FC<{ invitation: ContactsTypes.ContactInvitation; perspectiveOf: "sender" | "receiver" }> = ({
  invitation,
  perspectiveOf,
}) => {
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

  const handleSubmit = (variant: "accept" | "reject") => {
    let updatedInv: ContactsTypes.ContactInvitation = { ...invitation };

    switch (variant) {
      case "accept":
        updatedInv.status = "accepted";
        break;
      case "reject":
        updatedInv.status = "rejected";
        break;
    }

    ContactsAPI.resolvePendingInvitation(updatedInv).then(
      () => {
        if (variant === "accept") {
          // Update both users' contacts lists
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
        <p className={`font-app_primary font-[700] uppercase status-${subject?.status}`}>{subject?.status}</p>
      </div>
      <div className="flex Xflex-col items-center justify-evenly w-[64px] h-fit ">
        {perspectiveOf === "sender" && (
          <ReactIcons.MdCheck
            onClick={() => handleSubmit("accept")}
            className="invitation-action cursor-pointer text-white rounded-[2px] bg-green-700 hover:bg-green-600"
          />
        )}
        <ReactIcons.MdClose
          onClick={() => handleSubmit("reject")}
          className="invitation-action cursor-pointer text-white rounded-[2px] bg-red-700 hover:bg-red-600 "
        />
        {/* <MdInventory
          onClick={() => handleSubmit("archive")}
          className="invitation-action cursor-pointer text-white rounded-[2px] bg-cyan-700 hover:bg-cyan-600 p-[1px] "
        /> */}
      </div>
      <p className="flex text-right text-[11px] w-fit">{subject?.message}</p>
    </div>
  );
};

export default ContactItem;