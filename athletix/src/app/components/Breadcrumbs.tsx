"use client";
import React, { useContext, useEffect } from "react";
import BreadcrumbContext, { BreadcrumbNavItem } from "../BreadcrumbContext";

export default function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbNavItem[];
}) {
    const { setValue: setBreadcrumb } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumb(breadcrumbs);
    }, []);

    return <></>;
}
