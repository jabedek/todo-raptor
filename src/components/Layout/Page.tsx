type Props = {
  children: React.ReactNode;
};

export const Page: React.FC<Props> = ({ children }) => <div className="app_layout_padding w-full h-[220vh] ">{children}</div>;
