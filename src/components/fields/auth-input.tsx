"use client";

import { InputHTMLAttributes, ReactElement, useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline";
import { CalendarDaysIcon, Flag } from "lucide-react";

type IconType = "text" | "email" | "password" | "confirmPassword" | "number" | "date";

const iconMap: Record<IconType, ReactElement> = {
    text: <UserIcon className="h-5 w-5 text-teal-500" />,
    email: <EnvelopeIcon className="h-5 w-5 text-teal-500" />,
    password: <LockClosedIcon className="h-5 w-5 text-teal-500" />,
    confirmPassword: <LockClosedIcon className="h-5 w-5 text-teal-500" />,
    number: <EnvelopeOpenIcon className="h-5 w-5 text-teal-500" />,
    date: <CalendarDaysIcon className="h-5 w-5 text-teal-500" />
};

interface InputProps<T extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    label?: string;
    error?: string;
    register?: ReturnType<UseFormRegister<T>>;
    type?: IconType;
}

const AuthInput = <T extends FieldValues>({
    placeholder = "Enter text",
    type = "text",
    label,
    error,
    register,
    ...rest
}: InputProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = (type === "password" || type === "confirmPassword") ? (showPassword ? "text" : "password") : type;

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    {label}
                </label>
            )}

            <div className="relative">
                {type && iconMap[type] && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        {label === "Nationality" ?
                            <Flag className="h-5 w-5 text-teal-500" /> :
                            iconMap[type]}
                    </span>
                )}
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full ${type && iconMap[type] ? "pl-11" : "pl-3"
                        } ${(type === "password" || type === "confirmPassword") ? "pr-12" : "pr-4"} py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-aqua focus:outline-none focus:ring-2 focus:border-transparent`}
                    {...register}
                    {...rest}
                />
                {(type === "password" || type === "confirmPassword") && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default AuthInput;