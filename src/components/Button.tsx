type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;          
  iconPosition?: "left" | "right";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  icon,
  iconPosition = "left"
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        btn btn-${variant} btn-${size} 
        flex items-center gap-2
        ${className}
      `}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
}
