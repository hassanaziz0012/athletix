import React from "react";
import Templates from "./Templates";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Templates | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Templates", link: "/app/templates" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Templates />
        </section>
    );
}
