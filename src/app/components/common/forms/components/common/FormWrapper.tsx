import { CallbackFn } from "frotsi";

type Props = {
  title: string;
  children: React.ReactNode;
  submitFn?: CallbackFn;
  tailwindStyles?: string;
};

export const FormWrapper: React.FC<Props> = ({ title, children, tailwindStyles, submitFn }) => {
  return (
    <form
      onSubmit={submitFn}
      autoComplete="new-password"
      className={`transition-all duration-200   bg-white  p-5 flex flex-shrink-0 flex-col h-auto  items-center justify-between  rounded-[14px] shadow-lg ${tailwindStyles}`}>
      {title && <h2 className="uppercase text-center font-bold text-[13px] mt-1 text-black">{title}</h2>}
      {children}
    </form>
  );
};
