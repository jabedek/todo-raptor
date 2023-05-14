import { Children, useLayoutEffect, ReactElement, JSXElementConstructor, ReactFragment, useState } from "react";

type Props = {
  children: React.ReactNode;
  widthPx: string; // 220
  heightPxHeader: string; // 60
  heightPxBody: string; // 600 - 60 = 540
};

type ReactDivElement = ReactElement<JSXElementConstructor<HTMLDivElement>>;
type LocalChildElement = number | string | ReactFragment | ReactDivElement;

const SidePanel: React.FC<Props> = (props) => {
  const [divTop, setdivTop] = useState<ReactDivElement>();
  const [divBottom, setdivBottom] = useState<ReactDivElement>();
  useLayoutEffect(() => {
    const [d0, d1, ...rest] = Children.toArray(props.children) as LocalChildElement[] as ReactDivElement[];

    if (d0 && d1) {
      if (d0?.type === "div") {
        setdivTop(d0);
      } else {
        handleError({ which: "d0", type: `${d0.type || d0}` });
      }

      if (d1?.type === "div") {
        setdivBottom(d1);
      } else {
        handleError({ which: "d1", type: `${d1.type || d1}` });
      }
    } else {
      handleError({ which: "both", type: `${d0} & ${d1}` });
    }

    if (rest.length > 0) {
      console.error(
        `Only 2 <div> elements can be shown in SidePanel - header and body. Passing more elements will not cause it to display more.`
      );
    }
  }, [props]);

  const handleError = (child: { which: "d0" | "d1" | "both"; type: string }) => {
    switch (child.which) {
      case "d0":
        setdivTop(undefined);
        console.error(
          `First element passed as child (${child.type}) is not a <div> element. Pass only <div> elements into SidePanel.`
        );
        break;
      case "d1":
        setdivBottom(undefined);
        console.error(
          `Second element passed as child (${child.type}) is not a <div> element. Pass only <div> elements into SidePanel.`
        );
        break;
      case "both":
        setdivTop(undefined);
        setdivBottom(undefined);
        console.error(`Both children passed into SidePanel (${child?.type || child}) must be <div> elements.`);
        break;
    }
  };

  return (
    <>
      <div
        className=" flex flex-col bg-white justify-between h-auto "
        style={{ minWidth: `${props.widthPx}px` }}>
        <div
          className="w-full h-[60px] side-top"
          style={{ height: `${props.heightPxHeader}px` }}>
          {divTop}
        </div>
        <div
          className="w-full h-[540px] side-bottom"
          style={{ height: `${props.heightPxBody}px` }}>
          {divBottom}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
