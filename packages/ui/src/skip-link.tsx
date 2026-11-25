import { forwardRef, type AnchorHTMLAttributes } from "react";

export type SkipLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({ className = "", ...props }, ref) {
    return (
      <a
        {...props}
        ref={ref}
        className={`bg-primary text-on-primary focus-visible:outline-focus sr-only z-50 rounded-md px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      />
    );
  },
);

SkipLink.displayName = "SkipLink";
