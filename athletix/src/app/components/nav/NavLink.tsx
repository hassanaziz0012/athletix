import Link from "next/link";
import React from "react";

type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    hasIcon?: boolean;
};

export default function NavLink({ href, hasIcon = false, children }: NavLinkProps) {
    const classes = hasIcon ? "flex items-center gap-x-2" : "";

    return (
        <Link
            className={`hover:text-white duration-300 ${classes}`}
            href={href}
        >
            {children}
        </Link>
    );
}
