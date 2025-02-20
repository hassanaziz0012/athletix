import React from "react";

export type ButtonProps = {
    onClick: (() => void) | ((e: React.FormEvent) => void);
    children: React.ReactNode;
    type?: "button" | "submit";
    variant?: "square" | "regular" | "circle";
    size?: "normal" | "small";
    disabled?: boolean;
    className?: string;
};

export default function Button({
    onClick,
    children,
    type = "button",
    size = "normal",
    variant = "regular",
    disabled = false,
    className,
}: ButtonProps) {
    const sizes = {
        normal: "px-6 py-3",
        small: "px-2 py-1",
    };

    const variants = {
        circle: "rounded-full p-2",
        square: "rounded-md p-2",
        regular: `rounded-md ${sizes[size]}`,
    };

    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
