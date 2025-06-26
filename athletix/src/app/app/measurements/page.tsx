import React from "react";
import Measurements from "./Measurements";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Measurements | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Measurements", link: "/app/measurements" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Measurements />
        </section>
    );
}
