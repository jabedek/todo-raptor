import { ResultDisplay } from "@@types/common";

const ResultDisplayer: React.FC<{ message: ResultDisplay | undefined; tailwindStyles?: string }> = ({
  message,
  tailwindStyles,
}) => {
  return (
    <p
      className={`min-h-[50px] app_flex_center transition-all duration-200 italic py-3 text-sm overflow-x-auto 
      ${message && message?.isError ? "text-red-500" : "text-green-500"} ${tailwindStyles}`}>
      {message?.text}
    </p>
  );
};

export default ResultDisplayer;
