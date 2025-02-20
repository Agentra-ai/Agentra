import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-background p-4 shadow-input transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="mt-2 flex items-start gap-3.5 transition duration-200 group-hover/bento:translate-x-2">
        <div className="mt-0.5">{icon}</div>
        <div className="">
          <div className="mb-2 font-semibold">{title}</div>
          <div className="text-default-500 text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
};
