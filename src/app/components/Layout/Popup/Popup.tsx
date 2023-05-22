import { createContext, useContext, useEffect, useState, useRef } from "react";
import "./Popup.scss";
import { FormClearX } from "@@components/forms";
import { useNavigate } from "react-router-dom";

type PopupContext = {
  popupElement: JSX.Element | undefined;
  showPopup: (popupElement: JSX.Element, refreshOnClose?: boolean) => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContext>({
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
    const handleEscape = (e: KeyboardEvent) => (["Escape", "Esc"].includes(e.key) ? hide() : undefined);
    if (element) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [element]);

  const hide = (e?: React.MouseEvent, forced?: boolean) => {
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

const PopupProvider = ({ children }: any) => {
  const [popupElement, setpopupElement] = useState<JSX.Element>();
  const [refreshOnClose, setrefreshOnClose] = useState(false);

  const showPopup = (popupElement: JSX.Element, refreshOnClose?: boolean) => {
    setpopupElement(popupElement);
    setrefreshOnClose(!!refreshOnClose);
  };

  const hidePopup = () => setpopupElement(undefined);

  return (
    <PopupContext.Provider value={{ popupElement, hidePopup, showPopup }}>
      <Popup
        refreshOnClose={refreshOnClose}
        popupElement={popupElement}
        hidePopup={hidePopup}
      />
      {children}
    </PopupContext.Provider>
  );
};

function usePopupContext() {
  return useContext(PopupContext);
}

export { PopupProvider, usePopupContext };
