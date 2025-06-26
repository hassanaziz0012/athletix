"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Container from "@/app/components/Container";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import EditTemplateForm from "./EditTemplateForm";

export default function EditTemplatePage() {
    const searchParams = useSearchParams();
    const templateId = searchParams.get("id");

    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Templates", link: "/app/templates" },
        { name: "Edit Template", link: `/app/templates/edit?id=${templateId}` },
    ];

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Suspense>
                <section>
                    <Container>
                        {templateId && (
                            <EditTemplateForm templateId={templateId} />
                        )}
                    </Container>
                </section>
            </Suspense>
        </div>
    );
}
