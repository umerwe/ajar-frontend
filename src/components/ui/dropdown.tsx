"use client";
import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
  cloneElement,
  MouseEvent as ReactMouseEvent,
} from "react";

interface DropdownProps {
  button: ReactNode;
  children: ReactNode;
  initialOpen?: boolean;
  className?: string;
}

type ClickableElement = ReactElement<{
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
}>;

export default function Dropdown({
  button,
  children,
  initialOpen = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Wrap children to auto-close dropdown on click
  const childrenWithClose = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Narrow type so TS knows about onClick
    const element = child as ClickableElement;
    const originalOnClick = element.props.onClick;

    return cloneElement(element, {
      onClick: (e: ReactMouseEvent<HTMLElement>) => {
        originalOnClick?.(e);
        setIsOpen(false);
      },
    });
  });

  return (
    <div className="relative">
      <div ref={buttonRef} onClick={toggle}>
        {button}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={className}>
          {childrenWithClose}
        </div>
      )}
    </div>
  );
}
