import React from "react";
import Button, { ButtonProps } from "./Button";

export default function PrimaryButton({
    onClick,
    children,
    type = "button",
    size,
    variant,
    className,
    disabled,
}: ButtonProps) {
    return (
        <Button
            onClick={onClick}
            type={type}
            size={size}
            variant={variant}
            disabled={disabled}
            className={`text-white bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 duration-300 ${className}`}
        >
            {children}
        </Button>
    );
}
