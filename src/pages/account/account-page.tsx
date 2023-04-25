import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser } from "firebase/auth";

import { AuthAPI } from "@@api";
import UserVerification from "@@components/Auth/UserVerification";

const AccountPage: React.FC = () => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | null>();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const firebaseAuth = AuthAPI.getCurrentFirebaseAuthUser();
      setfirebaseAuthUser(firebaseAuth);
    }, 500);
  }, []);

  const test = () => {
    navigate("/projects-dashboard/123", { relative: "route" });
  };

  return (
    <div className="app_flex_center flex-col">
      AccountPage
      {firebaseAuthUser && firebaseAuthUser?.emailVerified === false && <UserVerification firebaseUser={firebaseAuthUser} />}
      {firebaseAuthUser && firebaseAuthUser?.emailVerified === true && (
        <div className="border-2 border-green-500 text-green-600 font-[400] text-md bg-white px-[8px] py-[3px] rounded-md">
          Verified!
        </div>
      )}
      <button onClick={test}>Test</button>
    </div>
  );
};

export default AccountPage;
