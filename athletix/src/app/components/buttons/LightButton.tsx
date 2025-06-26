import React from "react";
import Button, { ButtonProps } from "./Button";

export default function LightButton({
    onClick,
    children,
    type = "button",
    variant,
    className
}: ButtonProps) {
    return (
        <Button
            onClick={onClick}
            type={type}
            variant={variant}
            className={`bg-sky-100 text-sky-500 hover:bg-sky-200 duration-300 ${className}`}
        >
            {children}
        </Button>
    );
}
