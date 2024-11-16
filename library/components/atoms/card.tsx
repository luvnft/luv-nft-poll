import { cn } from "@/utils";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border-[1px] border-[#EFF1F8] p-4 shadow-[0_0_50px_7px_rgba(0,0,0,0.05)] bg-white",
        className && className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
