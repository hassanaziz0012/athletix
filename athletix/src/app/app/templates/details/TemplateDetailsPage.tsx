"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import TemplateDetails from "./TemplateDetails";
import Container from "@/app/components/Container";

export default function TemplateDetailsPage() {
    const params = useSearchParams();
    const templateId = params.get("id");

    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Templates", link: "/app/templates" },
        { name: "Details", link: `/app/templates/details?id=${templateId}` },
    ];

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Suspense>
                <section className="mt-16">
                    <Container>
                        {templateId ? (
                            <TemplateDetails templateId={templateId} />
                        ) : (
                            <div>
                                <p className="text-center text-xl text-red-500">
                                    Uh oh, you discovered a broken page.{" "}
                                </p>
                            </div>
                        )}
                    </Container>
                </section>
            </Suspense>
        </div>
    );
}
