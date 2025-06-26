import React from "react";
import Button, { ButtonProps } from "./Button";

export default function LightDangerButton({
    onClick,
    children,
    variant,
    type,
    disabled,
    className,
}: ButtonProps) {
    return (
        <Button
            onClick={onClick}
            type={type}
            variant={variant}
            disabled={disabled}
            className={`bg-red-50 text-red-500 hover:bg-red-100 disabled:bg-white disabled:text-red-300 duration-300 ${className}`}
        >
            {children}
        </Button>
    );
}
