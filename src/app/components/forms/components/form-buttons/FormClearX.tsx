import { Icons } from "@@components/Layout";
import { CallbackFn } from "frotsi";
import { CSSProperties, useEffect, useState } from "react";

type Props = {
  clickFn: CallbackFn;
  sizeVariant: "I" | "II" | "III";
  relatedItemId?: string | number;
};

const FormClearX: React.FC<Props> = ({ clickFn, relatedItemId, sizeVariant }) => {
  const [styles, setstyles] = useState<CSSProperties>();
  const handleClick = (e: React.MouseEvent): void => (relatedItemId ? clickFn(e, relatedItemId) : clickFn(e));

  useEffect(() => {
    let height = "";
    let width = "";
    let fontSize = "";
    let filter = "";

    switch (sizeVariant) {
      case "I": {
        height = "15px";
        width = "15px";
        fontSize = "13px";
        filter = "drop-shadow(0.35px 0.35px 2px rgba(0, 0, 0, 0.35))";
        break;
      }
      case "II": {
        height = "18px";
        width = "18px";
        fontSize = "16px";
        filter = "drop-shadow(0.5px 0.5px 2px rgba(0, 0, 0, 0.5))";
        break;
      }
      case "III": {
        height = "21px";
        width = "21px";
        fontSize = "19px";
        filter = "drop-shadow(0.55px 0.55px 2.5px rgba(0, 0, 0, 0.5))";
        break;
      }
    }

    const sizeStyles: CSSProperties = {
      height,
      width,
      fontSize,
      filter,
    };
    setstyles(sizeStyles);
  }, [sizeVariant]);

  return (
    <>
      <div
        className="transition-all duration-200 hover:rotate-180 cursor-pointer relative bg-white  text-black  hover:text-red-500 rounded-full app_flex_center text-center"
        style={styles}
        onClick={handleClick}>
        <Icons.MdClear className="absolute rounded-full" />
      </div>
    </>
  );
};

export default FormClearX;
