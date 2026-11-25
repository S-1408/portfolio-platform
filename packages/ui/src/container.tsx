import { forwardRef, type HTMLAttributes } from "react";

export type ContainerWidth = "sm" | "md" | "lg" | "xl" | "full";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  width?: ContainerWidth;
};

const widthClasses: Record<ContainerWidth, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container({ width = "xl", className = "", ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={`px-page-x mx-auto w-full ${widthClasses[width]} ${className}`}
      />
    );
  },
);

Container.displayName = "Container";
