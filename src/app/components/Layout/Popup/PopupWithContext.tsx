import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Popup.scss";
import { FormClearX } from "@@components/common";
import { RendersCounter } from "@@components/common/dev";

type PopupContextType = {
  popupElement: JSX.Element | undefined;
  showPopup: (popupElement: JSX.Element, refreshOnClose?: boolean) => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContextType>({
  popupElement: undefined,
  showPopup: (popupElement: JSX.Element, refreshOnClose?: boolean) => {},
  hidePopup: () => {},
});

type Props = {
  refreshOnClose: boolean;
  popupElement: JSX.Element | undefined;
  hidePopup: () => void;
};

const Popup: React.FC<Props> = ({ refreshOnClose, popupElement, hidePopup }) => {
  const [element, setelement] = useState<JSX.Element>();
  const [hiding, sethiding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setelement(popupElement);
  }, [popupElement]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => (["Escape", "Esc"].includes(e.key) ? hide() : undefined);
    if (element) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [element]);

  const hide = (e?: React.MouseEvent, forced?: boolean): void => {
    if (e?.currentTarget === e?.target || forced) {
      sethiding(true);
      setTimeout(() => {
        sethiding(false);
        hidePopup();
        if (refreshOnClose) {
          navigate(0);
        }
      }, 600);
    }
  };

  return (
    <div
      className={`app_popup__overlay 
        ${element && !hiding ? "in-transition " : ""} 
        ${element && hiding ? "out-transition " : ""}`}
      onClick={(e) => hide(e)}>
      <div
        className={`app_popup   text-sm font-semibold font-app_primary 
          ${element && !hiding ? " pop-anim" : ""} 
          ${element && hiding ? " pop-anim-rev" : ""} `}>
        <div className={`app_popup__content ${element && "Xp-[5px]"}`}> {element}</div>
        <div
          className={`app_popup__close 
            ${element ? "" : "hidden"} 
            transition-all duration-200 
            rounded-full `}>
          <FormClearX
            clickFn={() => hide(undefined, true)}
            sizeVariant="III"
          />
        </div>
      </div>
    </div>
  );
};

const PopupProvider: React.FC<{ children: React.ReactElement }> = ({ children }): React.ReactElement => {
  const [popupElement, setpopupElement] = useState<JSX.Element>();
  const [refreshOnClose, setrefreshOnClose] = useState(false);

  const showPopup = (popupElement: JSX.Element, refreshOnClose?: boolean): void => {
    setpopupElement(popupElement);
    setrefreshOnClose(!!refreshOnClose);
  };

  const hidePopup = (): void => setpopupElement(undefined);

  return (
    <PopupContext.Provider value={{ popupElement, hidePopup, showPopup }}>
      <RendersCounter componentName="PopupProvider" />
      <Popup
        refreshOnClose={refreshOnClose}
        popupElement={popupElement}
        hidePopup={hidePopup}
      />
      {children}
    </PopupContext.Provider>
  );
};

function usePopupContext(): PopupContextType {
  return useContext(PopupContext);
}

export { PopupProvider, usePopupContext };
