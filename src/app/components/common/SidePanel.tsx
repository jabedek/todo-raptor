import { Children, JSXElementConstructor, ReactElement, ReactFragment, useLayoutEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  forGroup: string;
};

type ReactDivElement = ReactElement<JSXElementConstructor<HTMLDivElement>>;
type LocalChildElement = number | string | ReactFragment | ReactDivElement;

export const SidePanel: React.FC<Props> = ({ forGroup, children }) => {
  const [divTop, setdivTop] = useState<ReactDivElement>();
  const [divBottom, setdivBottom] = useState<ReactDivElement>();
  useLayoutEffect(() => {
    const [d0, d1, ...rest] = Children.toArray(children) as LocalChildElement[] as ReactDivElement[];

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
  }, [forGroup, children]);

  const handleError = (child: { which: "d0" | "d1" | "both"; type: string }): void => {
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
      <div className={`side-panel side-panel--${forGroup} flex flex-col bg-white justify-between h-auto `}>
        <div className="w-full side-top">{divTop}</div>
        <div className="w-full side-bottom">{divBottom}</div>
      </div>
    </>
  );
};
