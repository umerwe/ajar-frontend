// CountryCodeInput.tsx
import React from 'react'
import { ChevronDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { CombinedFormData } from "@/validations/checkout";

interface CountryCodeInputProps {
    setValue: UseFormSetValue<CombinedFormData>;
    errors: FieldErrors<CombinedFormData>;
}

const CountryCodeInput: React.FC<CountryCodeInputProps> = ({ setValue, errors }) => {
    return (
        <div className="w-full sm:w-[30%]">
            <div className='bg-gray-100 rounded-md pt-1'>
                <label className="block text-sm pl-3 text-black">
                    Country/region <span className="text-red-500">*</span>
                </label>
                <div className="relative -mt-2">
                    <Select
                        onValueChange={(value) => setValue("countryCode", value, { shouldValidate: true })}
                        defaultValue="+1"
                    >
                        <SelectTrigger className="w-full bg-transparent text-black px-3 text-sm border-none focus:outline-none">
                            <SelectValue placeholder="+1" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+92">+92</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-black" />
                    </div>
                </div>
            </div>
            {errors.countryCode && (
                <p className="text-xs text-red-500 pl-3 pt-1">{errors.countryCode.message}</p>
            )}
        </div>
    )
}

export default CountryCodeInput;
