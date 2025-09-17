import React from "react";

interface SpecItemProps {
  icon: React.ReactNode;
  text: string | number | boolean;
}

const SpecItem: React.FC<SpecItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default SpecItem;
