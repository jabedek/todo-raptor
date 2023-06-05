type Props = {
  children: React.ReactNode;
};

export const Page: React.FC<Props> = ({ children }) => (
  <div className="app_layout_padding w-full min-h-[100vh] h-fit mt-[40px]">{children}</div>
);
