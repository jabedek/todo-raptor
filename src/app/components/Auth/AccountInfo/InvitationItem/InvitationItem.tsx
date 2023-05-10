import { useState, useEffect } from "react";
import { MdCheck, MdClose, MdInventory } from "react-icons/md";

import { InvitationTypes } from "@@types";
import "./InvitationItem.scss";
import { DateFormatter, DateFormats } from "@@utils/date-formatter";
import { InvitationsAPI } from "@@api/firebase";

const InvitationItem: React.FC<{ invitation: InvitationTypes.ContactInvitation; perspectiveOf: "sender" | "receiver" }> = ({
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

  const handleSubmit = (variant: "accept" | "reject" | "archive") => {
    let updatedInv: InvitationTypes.ContactInvitation = { ...invitation };

    switch (variant) {
      case "accept":
        updatedInv.status = "accepted";
        break;
      case "reject":
        updatedInv.status = "rejected";
        break;
    }

    InvitationsAPI.updateContactInvitationFull(updatedInv).then(
      () => {
        if (variant === "accept") {
          // Update both users' contacts lists

          InvitationsAPI.usersContactBond(invitation.receiver.id, invitation.sender.id, "make").then(
            () => {},
            (er) => console.error("Error while updating users' contacts. " + er)
          );
        }
      },
      (err) => console.error("Error while updating Contact Invitation object. " + err)
    );
  };

  return (
    <div className="flex items-center text-sm py-2 h-[64px] px-3 border-b border-gray-100 justify-between">
      <div className="flex flex-col font-[400] text-[11px] whitespace-pre min-w-[80px] ">
        <p className="font-app_mono ">{date}</p>
        <p className={`font-app_primary font-[700] uppercase status-${subject?.status}`}>{subject?.status}</p>
      </div>
      <div className="flex Xflex-col items-center justify-evenly w-[64px] h-fit ">
        {perspectiveOf === "sender" && (
          <MdCheck
            onClick={() => handleSubmit("accept")}
            className="invitation-action cursor-pointer text-white rounded-[2px] bg-green-700 hover:bg-green-600"
          />
        )}
        <MdClose
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

export default InvitationItem;
