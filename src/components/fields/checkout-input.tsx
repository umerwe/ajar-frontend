import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    type?: string;
    error?: string;
    className?: string;
}

const CheckoutInput = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            placeholder = "Enter text",
            type = "text",
            error,
            className = "py-3",
            ...rest
        },
        ref
    ) => {
        return (
            <div className="space-y-1">
                <input
                    type={type}
                    placeholder={placeholder}
                    ref={ref}
                    className={`w-full px-3 text-sm bg-gray-100
                        placeholder:text-gray-800 rounded-sm focus:outline-none 
                        focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
                    {...rest}
                />
                {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
            </div>
        );
    }
);

// ✅ Add display name for better debugging & linting
CheckoutInput.displayName = "CheckoutInput";

export default CheckoutInput;
