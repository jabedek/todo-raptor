const FormWrapper: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <form
      autoComplete="new-password"
      className="transition-all duration-200  bg-white  p-5 flex flex-shrink-0 flex-col h-[380px] w-[650px] items-center justify-between overflow-hidden 
  ">
      <h2 className="uppercase text-center font-bold text-md mt-1 text-black">{title}</h2>
      {children}
    </form>
  );
};

export default FormWrapper;
