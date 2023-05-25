type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  return <div className="app_layout_padding w-full min-h-[100vh] h-fit mt-[40px]">{children}</div>;
};

export default Page;
