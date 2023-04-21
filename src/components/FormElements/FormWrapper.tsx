import Card from "@@components/Layout/Card";

const FormWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
  tailwindStyles?: string;
}> = ({ title, children, tailwindStyles }) => {
  return (
    <form
      autoComplete="new-password"
      className={`transition-all duration-200   bg-white  p-5 flex flex-shrink-0 flex-col h-auto  items-center justify-between  rounded-[4px] shadow-lg ${tailwindStyles}`}>
      <h2 className="uppercase text-center font-bold text-md mt-1 text-black">{title}</h2>
      {children}
    </form>
  );
};

export default FormWrapper;
