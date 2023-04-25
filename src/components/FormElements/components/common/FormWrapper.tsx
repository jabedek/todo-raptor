import { CallbackFn } from "frotsi";

const FormWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
  submitFn: CallbackFn;
  tailwindStyles?: string;
}> = ({ title, children, tailwindStyles, submitFn }) => {
  return (
    <form
      onSubmit={submitFn}
      autoComplete="new-password"
      className={`transition-all duration-200   bg-white  p-5 flex flex-shrink-0 flex-col h-auto  items-center justify-between  rounded-[4px] shadow-lg ${tailwindStyles}`}>
      <h2 className="uppercase text-center font-bold text-md mt-1 text-black">{title}</h2>
      {children}
    </form>
  );
};

export default FormWrapper;