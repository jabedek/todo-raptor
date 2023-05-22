// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { FirebaseDB } from "../firebase-config";

// export const updateAppVersion = async (version: string) => updateDoc(doc(FirebaseDB, "metadata", "app"), { appVersion: version });

// export const getAppVersion = async () => {
//   const docRef = doc(FirebaseDB, "metadata", "app");
//   const docSnap = await getDoc(docRef);

//   return docSnap.exists() ? (docSnap.data() as { appVersion: string }) : undefined;
// };

// const MetadataAPI = { updateAppVersion, getAppVersion };

// export { MetadataAPI };
