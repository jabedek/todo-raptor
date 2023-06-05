type Props = {
  size: "extrasmall" | "small" | "medium" | "big" | "xl";
  colors?: string;
};

export const LoadingSpinner: React.FC<Props> = ({ size, colors }) => {
  let tailwindClass = "";
  if (!colors) {
    colors = "border-app_tertiary border-t-app_primary";
  }
  switch (size) {
    case "extrasmall":
      tailwindClass = "h-[12px] w-[12px] border-4";
      break;
    case "small":
      tailwindClass = "h-[24px] w-[24px] border-4";
      break;
    case "medium":
      tailwindClass = "h-[40px] w-[40px] border-8";
      break;
    case "big":
      tailwindClass = "h-[60px] w-[60px] border-8";
      break;
    case "xl":
      tailwindClass = "h-[80px] w-[80px] border-8";
      break;
  }

  return tailwindClass.length > 0 ? (
    <div className={`flex justify-center w-full `}>
      <div className={`animate-spin rounded-full ${tailwindClass} border-solid ${colors}`}></div>
    </div>
  ) : null;
};
