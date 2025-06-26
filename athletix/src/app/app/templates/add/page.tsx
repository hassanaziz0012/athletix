import Container from "@/app/components/Container";
import React from "react";
import AddTemplateForm from "./AddTemplateForm";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "New Template | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Templates", link: "/app/templates" },
        { name: "New Template", link: "/app/templates/add" },
    ];

    return (
        <section>
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <Container>
                <AddTemplateForm />
            </Container>
        </section>
    );
}
