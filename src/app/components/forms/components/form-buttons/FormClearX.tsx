import { CallbackFn } from "frotsi";
import { useEffect, useState, CSSProperties } from "react";
import { MdClear } from "react-icons/md";

type Props = {
  clickFn: CallbackFn;
  sizeVariant: "I" | "II" | "III";
  relatedItemId?: string | number;
};

// filter: drop-shadow(0.35px 0.35px 2px rgba(0, 0, 0, 0.35));
//         box-shadow: 0.5px  0.5px  3px rgba(0, 0, 0, 0.5) !important;

const FormClearX: React.FC<Props> = ({ clickFn, relatedItemId, sizeVariant }) => {
  const [styles, setstyles] = useState<CSSProperties>();
  const handleClick = (e: React.MouseEvent) => (relatedItemId ? clickFn(e, relatedItemId) : clickFn(e));

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
        className="transition-all duration-200 hover:rotate-180 cursor-pointer relative bg-white rounded-full app_flex_center text-center"
        style={styles}
        onClick={handleClick}>
        <MdClear className="absolute rounded-full text-red-700  hover:text-red-500" />
      </div>
    </>
  );
};

export default FormClearX;
