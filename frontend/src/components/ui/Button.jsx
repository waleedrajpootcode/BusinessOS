function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
}) {

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-3 rounded-lg transition ${
        variants[variant]
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;