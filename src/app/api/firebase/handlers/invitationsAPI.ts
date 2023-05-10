import { setDoc, doc, where, collection, query, getDocs, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { AuthAPI, FirebaseDB, UsersAPI } from "@@api/firebase";
import { InvitationTypes, UserTypes } from "@@types";

export const ContactsInvitationsRef = collection(FirebaseDB, "contacts-invitations");
export const ProjectInvitationsRef = collection(FirebaseDB, "project-invitations");

const saveNewInvitation = async (data: InvitationTypes.ContactInvitation) => {
  setDoc(doc(FirebaseDB, "contacts-invitations", data.id), data).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

const checkIfInvitationAlreadyExists = async (receiverId: string, senderId: string) => {
  if (!(receiverId && senderId)) {
    return undefined;
  }

  const queryRef = query(ContactsInvitationsRef, where("receiver.id", "==", receiverId), where("sender.id", "==", senderId));
  const queryRefSwapped = query(
    ContactsInvitationsRef,
    where("receiver.id", "==", senderId),
    where("sender.id", "==", receiverId)
  );

  const querySnapshot = await getDocs(queryRef);
  const querySnapshotSwapped = await getDocs(queryRefSwapped);

  const docs: InvitationTypes.ContactInvitation[] = [];

  querySnapshot.forEach((doc) => {
    docs.push(<InvitationTypes.ContactInvitation>doc.data());
  });

  querySnapshotSwapped.forEach((doc) => {
    docs.push(<InvitationTypes.ContactInvitation>doc.data());
  });

  return docs;
};

const getContactInvicationById = async (invitationId: string) => {
  if (!invitationId) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "contacts-invitations", invitationId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as InvitationTypes.ContactInvitation) : undefined;
};

const getContactInvicationsByIds = async (invitationsIds: string[]) => {
  UsersAPI.getUserDetailsById;
  if (!invitationsIds) {
    return undefined;
  }

  const queryRef = query(ContactsInvitationsRef, where("id", "in", [...invitationsIds]));
  const querySnapshot = await getDocs(queryRef);
  const docs: InvitationTypes.ContactInvitation[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<InvitationTypes.ContactInvitation>doc.data());
  });

  return docs;
};

const getCurrentUserPendingContactInvicationsByIds = async () => {
  return UsersAPI.getUserDetailsById(AuthAPI.getCurrentFirebaseAuthUser()?.uid).then(async (user: UserTypes.User | undefined) => {
    const invitationsIds = user?.contacts.invitationsIds || [];
    const docs: InvitationTypes.ContactInvitation[] = [];
    if (invitationsIds.length) {
      const queryRef = query(ContactsInvitationsRef, where("id", "in", [...invitationsIds]), where("status", "==", "pending"));
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((doc) => {
        docs.push(<InvitationTypes.ContactInvitation>doc.data());
      });
    }

    return docs;
  });
};

const updateContactInvitationFull = async (invitation: InvitationTypes.ContactInvitation) => {
  if (!invitation) {
    return undefined;
  }

  const receiverId = invitation.receiver.id;
  const senderId = invitation.sender.id;

  const usersRef = doc(FirebaseDB, "users", invitation.id);
  const invitationsRef = doc(FirebaseDB, "contacts-invitations", invitation.id);

  const promise0 = updateDoc(invitationsRef, invitation);
  const promise1 = updateDoc(usersRef, { "contacts.invitationsIds": arrayRemove(senderId) });
  const promise2 = updateDoc(usersRef, { "contacts.invitationsIds": arrayRemove(receiverId) });

  try {
    Promise.all([promise0, promise1, promise2]);
  } catch (e) {
    console.error(e);
  }
};

const usersContactBond = async (userId0: string, userId1: string, variant: "make" | "break") => {
  const user0 = doc(FirebaseDB, "users", userId0);
  const user1 = doc(FirebaseDB, "users", userId1);

  const promise0 = updateDoc(user0, { "contacts.contactsIds": variant === "make" ? arrayUnion(userId1) : arrayRemove(userId1) });
  const promise1 = updateDoc(user1, { "contacts.contactsIds": variant === "make" ? arrayUnion(userId0) : arrayRemove(userId0) });

  try {
    Promise.all([promise0, promise1]);
  } catch (e) {
    console.error(e);
  }
};

const InvitationsAPI = {
  ContactsInvitationsRef,
  ProjectInvitationsRef,

  checkIfInvitationAlreadyExists,
  saveNewInvitation,
  updateContactInvitationFull,

  usersContactBond,

  getContactInvicationById,
  getContactInvicationsByIds,

  getCurrentUserPendingContactInvicationsByIds,
};

export { InvitationsAPI };
