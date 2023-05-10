import { useCallback } from "react";
import "./RenderObject.scss";

type Props = {
  data: Record<string, any> | undefined;
  nested?: boolean;
  tailwindStyles?: string;
};

const RenderObject: React.FC<Props> = ({ data, nested, tailwindStyles }) => {
  const renderObject = useCallback(
    (obj: Record<string, any> | Array<any>) => JSON.stringify(obj, null, nested === false ? 0 : 2),
    []
  );
  return <div className={`render-object ${tailwindStyles}`}>{data ? renderObject(data) : <>undefined</>}</div>;
};

export default RenderObject;
