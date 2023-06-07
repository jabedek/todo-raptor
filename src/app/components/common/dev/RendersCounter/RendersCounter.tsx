import { RenderObject } from "../RenderObject/RenderObject";
import "./RendersCounter.scss";
import { useRenderCount } from "@uidotdev/usehooks";

export const SHOW_RENDERS = import.meta.env.VITE_REACT_APP_SHOW_RENDERS === "yes";

export const RendersCounter: React.FC<{ componentName: string }> = ({ componentName }) => {
  const renderInfo = useRenderCount(componentName);
  return (
    <>
      {SHOW_RENDERS && (
        <div className="renders-counter">
          <RenderObject
            data={[`${renderInfo} renders of ${componentName}`]}
            notNested={true}
            tailwindStyles="bg-red-400 p-1 rounded-sm shadow-md"></RenderObject>
        </div>
      )}
    </>
  );
};
