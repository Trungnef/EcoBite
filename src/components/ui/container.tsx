
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full px-4 sm:px-6 md:px-8 mx-auto max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
