import { forwardRef, type HTMLAttributes } from "react";

export type BadgeVariant = "neutral" | "primary" | "accent";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface text-ink",
  primary: "bg-primary text-on-primary",
  accent: "bg-accent-surface text-accent",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", className = "", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={`rounded-pill inline-flex items-center px-3 py-1 text-sm font-semibold ${variantClasses[variant]} ${className}`}
    />
  );
});

Badge.displayName = "Badge";
