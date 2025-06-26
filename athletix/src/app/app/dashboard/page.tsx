import React from "react";
import Dashboard from "./Dashboard";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Dashboard | Athletix",
}


export default function Page() {
    const breadcrumbs = [{ name: "Dashboard", link: "/app/dashboard" }];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Dashboard />
        </section>
    );
}
