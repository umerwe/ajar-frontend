import Input from "@/components/fields/checkout-input";
import CountryCodeInput from "../fields/country-code-input";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { CombinedFormData } from "@/validations/checkout";

interface GuestInformationFieldsProps {
    register: UseFormRegister<CombinedFormData>;
    setValue: UseFormSetValue<CombinedFormData>;
    errors: FieldErrors<CombinedFormData>;
    className?: string;
}

const GuestInformationFields = ({ 
    register, 
    setValue,
    errors, 
    className = "" 
}: GuestInformationFieldsProps) => {
    return (
        <div className={`space-y-4 ${className}`}>
            <div>
                <label className="block text-base font-medium text-gray-900">Name</label>
                <p className="text-sm text-gray-600 mb-3">Tell us the name of the person checking in.</p>
                <div className="space-y-3">
                    <Input
                        placeholder="First name *"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                    />
                    <Input
                        placeholder="Last name *"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                    />
                </div>
            </div>
            {/* Contact Section */}
            <div>
                <label className="block text-base font-medium text-gray-900">Contact Information</label>
                <p className="text-sm text-gray-600 mb-3">
                    We&rsquo;ll send your confirmation to this email address.
                </p>
                <div className="space-y-3">
                    <Input
                        placeholder="Email Address *"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <CountryCodeInput setValue={setValue} errors={errors} />
                            <div className="w-full sm:w-[70%]">
                                <Input
                                    placeholder="Phone number *"
                                    type="number"
                                    {...register("phoneNumber")}
                                    error={errors.phoneNumber?.message}
                                    className="py-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestInformationFields;
