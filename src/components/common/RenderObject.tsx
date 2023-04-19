import { useCallback } from "react";

type Props = {
  data: Record<string, any>;
  nested?: boolean;
};

const RenderObject: React.FC<Props> = ({ data, nested }) => {
  const renderObject = useCallback(
    (obj: Record<string, any> | Array<any>) => JSON.stringify(obj, null, nested === false ? 0 : 2),
    []
  );
  return <div className="render-object">{renderObject(data)}</div>;
};

export default RenderObject;
