import {
  createElement,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type SectionProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  id: string;
  heading: ReactNode;
  headingLevel?: 2 | 3 | 4;
  description?: ReactNode;
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    id,
    heading,
    headingLevel = 2,
    description,
    children,
    className = "",
    ...props
  },
  ref,
) {
  const headingId = `${id}-heading`;

  return (
    <section
      {...props}
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      className={`space-y-6 ${className}`}
    >
      {createElement(
        `h${headingLevel}`,
        {
          id: headingId,
          className: "text-2xl font-semibold tracking-tight text-ink",
        },
        heading,
      )}
      {description ? (
        <div className="text-muted max-w-3xl">{description}</div>
      ) : null}
      {children}
    </section>
  );
});

Section.displayName = "Section";
