import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes,
} from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export type ButtonAsButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export type ButtonAsLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

type ButtonComponent = {
  (
    props: ButtonAsButtonProps & RefAttributes<HTMLButtonElement>,
  ): ReactElement | null;
  (
    props: ButtonAsLinkProps & RefAttributes<HTMLAnchorElement>,
  ): ReactElement | null;
  displayName?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-border bg-transparent text-ink hover:bg-surface",
  ghost: "border border-transparent bg-transparent text-ink hover:bg-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-base",
  lg: "min-h-12 px-6 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50";

function isButtonLinkProps(props: ButtonProps): props is ButtonAsLinkProps {
  return typeof props.href === "string";
}

function getButtonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonBaseProps) {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

const ButtonImplementation = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  if (isButtonLinkProps(props)) {
    const { href, variant, size, className, ...linkProps } = props;

    return (
      <a
        {...linkProps}
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        href={href}
        className={getButtonClassName({ variant, size, className })}
      />
    );
  }

  const { variant, size, className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      type={props.type ?? "button"}
      className={getButtonClassName({ variant, size, className })}
    />
  );
});

ButtonImplementation.displayName = "Button";

export const Button = ButtonImplementation as ButtonComponent;
