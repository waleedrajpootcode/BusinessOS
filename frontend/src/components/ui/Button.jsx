function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-[var(--bos-surface-dark)] text-[var(--bos-brand-primary)] border border-[var(--bos-surface-dark)] hover:bg-[var(--bos-surface-dark-soft)] hover:border-[var(--bos-surface-dark-soft)] shadow-sm hover:shadow-md",

    danger:
      "bg-[var(--bos-danger)] text-white border border-[var(--bos-danger)] hover:opacity-90 shadow-sm hover:shadow-md",

    success:
      "bg-[var(--bos-success)] text-white border border-[var(--bos-success)] hover:opacity-90 shadow-sm hover:shadow-md",

    secondary:
      "bg-[var(--bos-surface)] text-[var(--bos-text-secondary)] border border-[var(--bos-border-strong)] hover:bg-[var(--bos-surface-soft)] hover:border-[var(--bos-brand-primary)] shadow-sm hover:shadow-md",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        min-h-11
        px-5
        py-2.5
        rounded-xl
        font-semibold
        text-sm
        tracking-tight
        transition-all
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--bos-brand-primary)]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:shadow-none
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;