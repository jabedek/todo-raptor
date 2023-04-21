import { useCallback } from "react";

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
  return data ? <div className={`render-object ${tailwindStyles}`}>{renderObject(data)}</div> : <></>;
};

export default RenderObject;
