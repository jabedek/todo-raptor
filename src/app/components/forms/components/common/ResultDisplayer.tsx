export type ResultDisplay = { text: string; isError: boolean; isLoading?: boolean };

type Props = { message: ResultDisplay | undefined; tailwindStyles?: string };

export const ResultDisplayer: React.FC<Props> = ({ message, tailwindStyles }) => {
  return (
    <div
      className={`${tailwindStyles} min-h-[56px] app_flex_center transition-all duration-200 italic text-sm overflow-x-auto whitespace-pre
      ${message?.isLoading ? "text-app_tertiary" : message && message?.isError ? "text-red-500" : "text-green-500"} `}>
      {message?.isLoading ? "Loading..." : message?.text}
    </div>
  );
};
