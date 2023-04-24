import { createContext, useContext, useState } from "react";
import "./popup.scss";
import { MdClear } from "react-icons/md";
import FormClearX from "@@components/FormElements/form-buttons/FormClearX";

type PopupContext = {
  element: JSX.Element | undefined;
  showPopup: (element: JSX.Element) => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContext>({
  element: undefined,
  showPopup: (element: JSX.Element) => {},
  hidePopup: () => {},
});

const Popup: React.FC = () => {
  const { element, hidePopup } = usePopupContext();
  const [hiding, sethiding] = useState(false);

  const hide = (e: React.MouseEvent, forced?: boolean) => {
    console.log("match", e.currentTarget === e.target);
    console.log("forced", forced);

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
        ${element && !hiding && "in-transition "} 
        ${element && hiding && "out-transition "}`}
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
            clickAction={(e) => hide(e, true)}
            sizeVariant="III"
          />
        </div>
      </div>
    </div>
  );
};

const PopupProvider = ({ children }: any) => {
  const [element, setelement] = useState<JSX.Element>();

  const showPopup = (element: JSX.Element) => setelement(element);
  const hidePopup = () => setelement(undefined);

  return (
    <>
      <PopupContext.Provider value={{ element, showPopup, hidePopup }}>
        <Popup />
        {children}
      </PopupContext.Provider>
    </>
  );
};

function usePopupContext() {
  return useContext(PopupContext);
}

export { PopupContext, PopupProvider, usePopupContext };
