import { ComponentProps, ReactNode } from "react";

interface SelectProps extends ComponentProps<'select'> {
    label: string;
    required?: boolean;
    children: ReactNode;
}

export default function Select({ label, required = true, children, ...props }: SelectProps) {
    return (
        <div>
            <label className="block mb-2 font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className="w-full p-3 border h-12 border-gray-400 rounded-md focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
                {...props}
            >
                {children}
            </select>
        </div>
    );
}
