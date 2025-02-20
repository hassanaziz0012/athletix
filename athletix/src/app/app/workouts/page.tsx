import React from "react";
import Workouts from "./Workouts";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Workouts | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Workouts", link: "/app/workouts" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Workouts />
        </section>
    );
}
