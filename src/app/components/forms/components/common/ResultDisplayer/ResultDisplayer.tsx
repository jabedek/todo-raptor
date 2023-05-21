export type ResultDisplay = { text: string; isError: boolean };

type Props = { message: ResultDisplay | undefined; tailwindStyles?: string };

const ResultDisplayer: React.FC<Props> = ({ message, tailwindStyles }) => {
  return (
    <div
      className={`min-h-[56px] app_flex_center transition-all duration-200 italic text-sm overflow-x-auto whitespace-pre
      ${message && message?.isError ? "text-red-500" : "text-green-500"} ${tailwindStyles}`}>
      {message?.text}
    </div>
  );
};

export default ResultDisplayer;
