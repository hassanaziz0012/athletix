import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: ContainerSizes;
}

export enum ContainerSizes {
    normal = "max-w-screen-md",
    large = "max-w-screen-lg",
    extralarge = "max-w-screen-xl",
}

export default function Container({ children, className, size = ContainerSizes.large }: ContainerProps) {
    return <div className={`${size} ${className} mx-auto px-10`}>{children}</div>;
}
