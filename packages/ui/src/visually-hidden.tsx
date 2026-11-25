import { forwardRef, type HTMLAttributes } from "react";

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className = "", ...props }, ref) {
    return <span {...props} ref={ref} className={`sr-only ${className}`} />;
  },
);

VisuallyHidden.displayName = "VisuallyHidden";
