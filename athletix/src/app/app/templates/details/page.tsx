import React, { Suspense } from "react";
import { Metadata } from "next";
import TemplateDetailsPage from "./TemplateDetailsPage";

export const metadata: Metadata = {
    title: "Template Details | Athletix",
};

export default function Page() {
    return (
        <Suspense>
            <TemplateDetailsPage />
        </Suspense>
    );
}
