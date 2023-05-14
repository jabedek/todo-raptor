export type ContactInvitation = {
  id: string;
  sender: {
    id: string;
    email: string;
  };
  receiver: {
    id: string;
    email: string;
  };
  status: "pending" | "accepted" | "rejected";
  sentAt: string;
};

export type Contact = {
  id: string;
  email: string;
};
