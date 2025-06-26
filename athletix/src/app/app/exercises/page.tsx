import React from "react";
import Exercises from "./Exercises";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Exercises | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Exercises", link: "/app/exercises" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Exercises />
        </section>
    );
}
