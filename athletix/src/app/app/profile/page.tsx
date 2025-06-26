import React from "react";
import Profile from "./Profile";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "Profile | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Profile", link: "/app/profile" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Profile />
        </section>
    );
}
