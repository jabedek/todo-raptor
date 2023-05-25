/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import "./RenderObject.scss";

type Props = {
  data: Record<string, any> | Array<any> | undefined;
  notNested?: boolean;
  tailwindStyles?: string;
};

const RenderObject: React.FC<Props> = ({ data, notNested, tailwindStyles }) => {
  const [objectData, setobjectData] = useState("");

  useEffect(() => {
    if (data) {
      setobjectData(renderObject(data));
    }
  }, [data]);

  const renderObject = useCallback(
    (obj: Record<string, any> | Array<any>) => JSON.stringify(obj, null, !notNested === false ? 0 : 2),
    []
  );

  return <div className={`render-object ${tailwindStyles}`}>{objectData ? objectData : "undefined"}</div>;
};

export default RenderObject;
