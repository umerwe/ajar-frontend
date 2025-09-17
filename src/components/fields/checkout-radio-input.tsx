import React from "react";

interface RadioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
}

const RadioInput = React.forwardRef<HTMLInputElement, RadioInputProps>(
    ({ labelText, ...rest }, ref) => {
        return (
            <div className="flex items-center">
                <input
                    type="radio"
                    ref={ref}
                    className="w-4 h-4 accent-blue-500 border-white"
                    {...rest}
                />
                <label className="ml-3 text-sm font-medium text-gray-900">
                    {labelText}
                </label>
            </div>
        );
    }
);

// ✅ Fix: add display name
RadioInput.displayName = "RadioInput";

export default RadioInput;
