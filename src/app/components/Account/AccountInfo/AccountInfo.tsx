import { useEffect, useState } from "react";

import { InputWritten } from "@@components/forms";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { UserVerification, AccountContacts } from "@@components/Account";
import { useContactsValue, useUserValue } from "@@contexts";
import { User } from "@@types";
import { UsersAPI } from "@@api/firebase";

const AccountInfo: React.FC = () => {
  const { user, firebaseAuthUser } = useUserValue();
  const { contacts } = useContactsValue();
  const { showPopup } = usePopupContext();
  const [name, setname] = useState(user?.personal?.names?.name);
  const [lastname, setlastname] = useState(user?.personal?.names?.lastname);
  const [nickname, setnickname] = useState(user?.personal?.names?.nickname);
  const [userChanged, setuserChanged] = useState(false);
  const popupVerification = () => showPopup(<UserVerification firebaseUser={firebaseAuthUser} />);

  useEffect(() => {
    if (user) {
      const nameChanged = user.personal.names.name !== name && !!name;
      const lastnameChanged = user.personal.names.lastname !== lastname && !!lastname;
      const nicknameChanged = user.personal.names.nickname !== nickname && !!nickname;

      if (nameChanged || lastnameChanged || nicknameChanged) {
        setuserChanged(true);
      }
    }
  }, [lastname, nickname, name]);

  const update = () => {
    if (user) {
      const updatedUser: User = { ...user };
      if (updatedUser.personal && userChanged) {
        updatedUser.personal.names.name = name ?? updatedUser.personal.names.name;
        updatedUser.personal.names.lastname = lastname ?? updatedUser.personal.names.lastname;
        updatedUser.personal.names.nickname = nickname ?? updatedUser.personal.names.nickname;

        UsersAPI.updateUserFull(updatedUser).then(() => setuserChanged(false));
      }
    }
  };

  return (
    <>
      <div className=" flex flex-col bg-white justify-between w-full min-w-[900px] h-[800px] rounded-[14px] p-[6px] font-app_primary font-semibold">
        <div className="flex w-full h-[750px]">
          <div className="relative flex flex-col p-2  min-w-[270px] max-w-[500px] w-full h-full">
            <p className="flex items-center justify-between h-[30px] mb-2">Personal details</p>
            <InputWritten
              changeFn={(e) => setname(e)}
              name="user-name"
              value={name}
              label="Name"
              type="text"
              tailwindStyles="min-w-[250px] w-full"
            />
            <InputWritten
              changeFn={(e) => setlastname(e)}
              name="user-lastname"
              value={lastname}
              label="Last Name"
              type="text"
              tailwindStyles="min-w-[250px] w-full"
            />
            <InputWritten
              changeFn={(e) => setnickname(e)}
              name="user-nickname"
              value={nickname}
              label="Display Name"
              type="text"
              tailwindStyles="min-w-[250px] w-full"
            />
            <div className="app_flex_center">
              <Button
                formStyle="primary"
                clickFn={update}
                label="Save"
                disabled={!userChanged}
              />
            </div>
          </div>

          <div className="flex flex-col min-w-[310px] max-w-[600px] justify-between w-full h-full p-2 border-l ">
            <AccountContacts
              user={user}
              contacts={contacts}
            />
          </div>

          <div className="flex flex-col min-w-[300px] w-full  h-auto p-2 border-l ">
            <div className="flex flex-col w-full  h-full">
              <p className="flex items-center justify-between min-h-[30px] ">
                Notifications
                <Button
                  label="Clear"
                  clickFn={() => {}}
                  tailwindStyles="ml-2 font-[600] px-2 py-1 bg-app_tertiary rounded-[4px] text-[11px] font-[500] transition-all transition-200 hover:bg-app_tertiary_light"
                />
              </p>
              <ul className="h-full w-full border rounded-[3px] overflow-y-scroll">IN WORKS...</ul>
            </div>
          </div>
        </div>

        <div className="flex h-[48px] pt-2 items-center  relative  w-full justify-center border-t">
          {!firebaseAuthUser && "Checking verification..."}
          {firebaseAuthUser && firebaseAuthUser?.emailVerified === false && (
            <div
              className="border-2 border-red-500 text-red-600 font-[400] text-md bg-white px-[8px] py-[3px] rounded-md cursor-pointer"
              onClick={popupVerification}>
              Not Verified - check you mailbox or click here to resend verification email.
            </div>
          )}
          {firebaseAuthUser && firebaseAuthUser?.emailVerified === true && (
            <div className="border-2 border-green-500 text-green-600 font-[400] text-md bg-white px-[8px] py-[3px] rounded-md">
              Verified!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountInfo;
