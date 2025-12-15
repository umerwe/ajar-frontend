import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 md:mb-10 pt-4 md:pt-6" }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export default Container;
