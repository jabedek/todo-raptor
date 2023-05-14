import { CommonTypes } from "@@types";

const ResultDisplayer: React.FC<{ message: CommonTypes.ResultDisplay | undefined; tailwindStyles?: string }> = ({
  message,
  tailwindStyles,
}) => {
  return (
    <div
      className={`min-h-[56px] app_flex_center transition-all duration-200 italic text-sm overflow-x-auto whitespace-pre
      ${message && message?.isError ? "text-red-500" : "text-green-500"} ${tailwindStyles}`}>
      {message?.text}
    </div>
  );
};

export default ResultDisplayer;
