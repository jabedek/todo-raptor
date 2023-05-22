import {
  setDoc,
  doc,
  where,
  collection,
  query,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { AuthAPI, FirebaseDB, UsersAPI } from "@@api/firebase";
import { ContactInvitation, User } from "@@types";
import { CallbackFn } from "frotsi";
import { Contact } from "src/app/types/Contacts";

export const ContactsInvitationsRef = collection(FirebaseDB, "contacts-invitations");
export const ProjectInvitationsRef = collection(FirebaseDB, "project-invitations");

const saveNewInvitation = async (data: ContactInvitation) => {
  setDoc(doc(FirebaseDB, "contacts-invitations", data.id), data).then(
    () => {},
    (error) => console.log(error)
  );
};

const checkIfPendingInvitationExists = async (receiverId: string, senderId: string) => {
  if (!(receiverId && senderId)) {
    return undefined;
  }

  const queryRef = query(
    ContactsInvitationsRef,
    where("receiver.id", "==", receiverId),
    where("sender.id", "==", senderId),
    where("status", "==", "pending")
  );
  const queryRefSwapped = query(
    ContactsInvitationsRef,
    where("receiver.id", "==", senderId),
    where("sender.id", "==", receiverId)
  );

  const querySnapshot = await getDocs(queryRef);
  const querySnapshotSwapped = await getDocs(queryRefSwapped);

  const docs: ContactInvitation[] = [];

  querySnapshot.forEach((doc) => {
    docs.push(<ContactInvitation>doc.data());
  });

  querySnapshotSwapped.forEach((doc) => {
    docs.push(<ContactInvitation>doc.data());
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

  return docSnap.exists() ? (data as ContactInvitation) : undefined;
};

const getContactInvicationsByIds = async (invitationsIds: string[]) => {
  if (!invitationsIds) {
    return undefined;
  }

  const queryRef = query(ContactsInvitationsRef, where("id", "in", [...invitationsIds]));
  const querySnapshot = await getDocs(queryRef);
  const docs: ContactInvitation[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<ContactInvitation>doc.data());
  });

  return docs;
};

const getCurrentUserPendingContactInvicationsByIds = async () => {
  return UsersAPI.getUserDetailsById(AuthAPI.getCurrentFirebaseAuthUser()?.uid).then(async (user: User | undefined) => {
    const invitationsIds = user?.contacts.invitationsIds || [];
    const docs: ContactInvitation[] = [];
    if (invitationsIds.length) {
      const queryRef = query(ContactsInvitationsRef, where("id", "in", [...invitationsIds]), where("status", "==", "pending"));
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((doc) => {
        docs.push(<ContactInvitation>doc.data());
      });
    }

    return docs;
  });
};

const removePendingInvitation = async (invitation: ContactInvitation) => {
  if (!invitation) {
    return undefined;
  }

  const invitationId = invitation.id;
  const receiverId = invitation.receiver.id;
  const senderId = invitation.sender.id;

  const invitationsRef = doc(FirebaseDB, "contacts-invitations", invitationId);
  const receiverRef = doc(FirebaseDB, "users", receiverId);
  const senderRef = doc(FirebaseDB, "users", senderId);

  const promise0 = updateDoc(invitationsRef, invitation);
  const promise1 = updateDoc(receiverRef, { "contacts.invitationsIds": arrayRemove(invitationId) });
  const promise2 = updateDoc(senderRef, { "contacts.invitationsIds": arrayRemove(invitationId) });

  try {
    Promise.all([promise0, promise1, promise2]);
  } catch (e) {
    console.error(e);
  }
};

const updateContactsBond = async (userId0: string, userId1: string, variant: "make" | "break") => {
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

const listenToUserContactsData = async (user: User, cb: CallbackFn) => {
  const queryRef = query(collection(FirebaseDB, "users"), where("authentication.id", "in", [...user.contacts.contactsIds]));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    let docs: Contact[] = [];
    querySnapshot.forEach((doc) => {
      const { authentication } = doc.data() as User;
      docs.push({ id: authentication.id, email: `${authentication.email}` });
    });

    cb(docs, unsub);
  });
};

const ContactsAPI = {
  checkIfPendingInvitationExists,
  saveNewInvitation,
  removePendingInvitation,

  updateContactsBond,

  getContactInvicationById,
  getContactInvicationsByIds,

  getCurrentUserPendingContactInvicationsByIds,

  listenToUserContactsData,
};

export { ContactsAPI };
