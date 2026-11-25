import { forwardRef, type HTMLAttributes } from "react";

export type TagProps = HTMLAttributes<HTMLSpanElement>;

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { className = "", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={`rounded-pill border-border bg-surface text-ink inline-flex items-center border px-3 py-1 text-sm font-medium ${className}`}
    />
  );
});

Tag.displayName = "Tag";
