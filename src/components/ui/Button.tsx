import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "champagne" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  withArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  withArrow = false,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-[0.18em] uppercase transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#907553] cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-[11px] py-2 px-4 gap-2",
    md: "text-[12px] py-3 px-6 sm:px-7 gap-2.5",
    lg: "text-[13px] py-3.5 px-8 sm:px-9 gap-3",
  };

  const variantStyles = {
    primary:
      "bg-[#151007] text-[#FAF7F2] border border-[#151007] hover:bg-[#3A2E21] hover:border-[#3A2E21] active:scale-[0.99]",
    secondary:
      "bg-[#F7F1E8] text-[#151007] border border-[#D8C9B6] hover:bg-[#FAF7F2] hover:border-[#907553] active:scale-[0.99]",
    outline:
      "bg-transparent text-[#151007] border border-[#211A12] hover:bg-[#151007] hover:text-[#FAF7F2] active:scale-[0.99]",
    champagne:
      "bg-[#907553] text-[#FAF7F2] border border-[#907553] hover:bg-[#7D6444] active:scale-[0.99]",
    link:
      "bg-transparent text-[#211A12] p-0 border-b border-transparent hover:border-[#907553] hover:text-[#907553] tracking-[0.16em]",
  };

  const appliedClass = `${baseStyles} ${variant !== "link" ? sizeStyles[size] : "text-[11px] sm:text-[12px] py-1 gap-1.5 font-medium"} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          size={14}
          strokeWidth={1.75}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={appliedClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={appliedClass} {...props}>
      {content}
    </button>
  );
};
