import UserVerification from "@@components/Auth/UserVerification";
import { User as FirebaseAuthUser } from "firebase/auth";
import { AuthContext } from "@@context/AuthContext";

import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { getCurrentFirebaseAuthUser } from "@@services/firebase/api/authAPI";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const currentFirebaseAuthUser: MutableRefObject<FirebaseAuthUser | null> = useRef(getCurrentFirebaseAuthUser());
  const navigate = useNavigate();

  const test = () => {
    navigate("/dashboard/123", { relative: "route" });
  };

  return (
    <div className="app_flex_center flex-col">
      AccountPage
      {currentFirebaseAuthUser.current?.emailVerified === false ? (
        <UserVerification firebaseUser={currentFirebaseAuthUser.current} />
      ) : (
        <div className="border-2 border-green-500 text-green-600 font-[400] text-md bg-white px-[8px] py-[3px] rounded-md">
          Verified!
        </div>
      )}
      <button onClick={test}>Test</button>
    </div>
  );
};

export default AccountPage;
