import Input from "@/components/fields/checkout-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RadioInput from "../fields/checkout-radio-input";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { CombinedFormData } from "@/validations/checkout";

interface PaymentFieldsProps {
    register: UseFormRegister<CombinedFormData>;
    setValue: UseFormSetValue<CombinedFormData>;
    errors: FieldErrors<CombinedFormData>;
}

const PaymentFields = ({ register, setValue, errors }: PaymentFieldsProps) => {
    return (
        <div className="bg-white rounded-lg sm:pt-2 sm:pb-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose how to pay</h2>
            <div className="space-y-4 mb-6">
                <RadioInput
                    labelText="Pay in full today"
                    value="full"
                    {...register("paymentOption")}
                />
                <RadioInput
                    labelText="Pay over time with Affirm"
                    value="affirm"
                    {...register("paymentOption")}
                />
                {errors.paymentOption && (
                    <p className="text-red-500 text-sm">{errors.paymentOption.message}</p>
                )}
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment method</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Safe, secure transactions. Your personal information is protected.
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {["PayPal", "JCB", "VISA", "DIS", "AE", "UP", "DIN"].map((text) => (
                        <div
                            key={text}
                            className="w-10 h-6 bg-gray-700 rounded flex items-center justify-center"
                        >
                            <span className="text-white text-xs font-bold">{text}</span>
                        </div>
                    ))}
                </div>
                <div className="border rounded-lg px-4 py-3 mb-4">
                    <div className="flex items-center gap-3">
                        <Select
                            onValueChange={(value) =>
                                setValue("cardType", value as CombinedFormData["cardType"])
                            }
                            defaultValue="VISA"
                        >
                            <SelectTrigger className="w-full border-none shadow-none p-0 text-sm font-medium text-gray-900">
                                <SelectValue placeholder="VISA" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "PayPal",
                                    "JCB",
                                    "VISA",
                                    "Discover",
                                    "American Express",
                                    "UnionPay",
                                    "Diners Club",
                                ].map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {errors.cardType && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardType.message}</p>
                    )}
                </div>
                <div className="space-y-4">
                    <Input
                        {...register("name")}
                        placeholder="Full name *"
                        error={errors.name?.message}
                        className="py-3.5"
                    />
                    <div>
                        <div className="bg-gray-100 pl-3 py-1.5 rounded-md max-w-50">
                            <label className="block text-sm text-black">
                                Expiration date{" "}
                                <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="max-full bg-transparent text-gray-800 placeholder:text-gray-500 placeholder:font-semibold px-0 border-0 focus:outline-none focus:ring-0 text-sm"
                                {...register("expiryDate")}
                            />
                        </div>
                        {errors.expiryDate && (
                            <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
                        )}
                    </div>
                    <Input
                        {...register("billingZip")}
                        placeholder="Billing ZIP code *"
                        error={errors.billingZip?.message}
                        className="py-3.5"
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentFields;
