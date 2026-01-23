import { ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps extends ComponentProps<'button'> {
    variant?: ButtonVariant;
}

export default function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
    const baseStyle = "px-6 py-3 font-semibold rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center gap-2";

    const variantStyles: Record<ButtonVariant, string> = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/85",
        secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400",
        destructive: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button
            className={`${baseStyle} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
