const Card: React.FC<{
  children: React.ReactNode;
  tailwindStyles?: `h-${string}` | `w-${string}`;
}> = ({ children, tailwindStyles }) => {
  return (
    <div
      className={`transition-all duration-200  bg-white  p-5 flex flex-shrink-0 flex-col min-h-[380px] min-w-[650px] items-center justify-between overflow-hidden rounded-[4px] shadow-lg ${tailwindStyles}`}>
      {children}
    </div>
  );
};

export default Card;
