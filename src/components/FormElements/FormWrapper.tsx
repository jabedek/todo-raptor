import Card from "@@components/Layout/Card";

const FormWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
  styles?: string;
}> = ({ title, children, styles }) => {
  return (
    <form
      autoComplete="new-password"
      className={`transition-all duration-200   bg-white  p-5 flex flex-shrink-0 flex-col min-h-[380px]  items-center justify-between  rounded-[4px] shadow-lg ${styles}`}>
      <h2 className="uppercase text-center font-bold text-md mt-1 text-black">{title}</h2>
      {children}
    </form>
  );
};

export default FormWrapper;
