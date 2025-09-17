const Loader = (
  {
    className = "w-5 h-5 border-t-transparent"
  }
    : { className?: string }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 ${className}
        `}
    />
  );
};

export default Loader;
