import { createContext, useContext, useState } from "react";
import "./Popup.scss";
import { FormClearX } from "@@components/forms";

type PopupContext = {
  popupElement: JSX.Element | undefined;
  showPopup: (popupElement: JSX.Element) => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContext>({
  popupElement: undefined,
  showPopup: (popupElement: JSX.Element) => {},
  hidePopup: () => {},
});

const Popup: React.FC = () => {
  const { popupElement, hidePopup } = usePopupContext();
  const [hiding, sethiding] = useState(false);

  const hide = (e: React.MouseEvent, forced?: boolean) => {
    if (e.currentTarget === e.target || forced) {
      sethiding(true);
      setTimeout(() => {
        sethiding(false);
        hidePopup();
      }, 600);
    }
  };

  return (
    <div
      className={`app_popup__overlay 
        ${popupElement && !hiding && "in-transition "} 
        ${popupElement && hiding && "out-transition "}`}
      onClick={(e) => hide(e)}>
      <div
        className={`app_popup   text-sm font-semibold font-app_primary 
          ${popupElement && !hiding ? " pop-anim" : ""} 
          ${popupElement && hiding ? " pop-anim-rev" : ""} `}>
        <div className={`app_popup__content ${popupElement && "Xp-[5px]"}`}> {popupElement}</div>
        <div
          className={`app_popup__close 
            ${popupElement ? "" : "hidden"} 
            transition-all duration-200 
            rounded-full `}>
          <FormClearX
            clickFn={(e) => hide(e, true)}
            sizeVariant="III"
          />
        </div>
      </div>
    </div>
  );
};

const PopupProvider = ({ children }: any) => {
  const [popupElement, setelement] = useState<JSX.Element>();

  const showPopup = (popupElement: JSX.Element) => {
    console.log(popupElement);

    setelement(popupElement);
  };
  const hidePopup = () => setelement(undefined);

  return (
    <PopupContext.Provider value={{ popupElement, showPopup, hidePopup }}>
      <Popup />
      {children}
    </PopupContext.Provider>
  );
};

function usePopupContext() {
  return useContext(PopupContext);
}

export { PopupProvider, usePopupContext };
