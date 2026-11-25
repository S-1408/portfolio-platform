import { forwardRef, type HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  raised?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { raised = false, className = "", ...props },
  ref,
) {
  const elevation = raised ? "shadow-raised" : "shadow-card";

  return (
    <div
      {...props}
      ref={ref}
      className={`border-border bg-surface-raised p-card text-ink rounded-lg border ${elevation} ${className}`}
    />
  );
});

Card.displayName = "Card";
