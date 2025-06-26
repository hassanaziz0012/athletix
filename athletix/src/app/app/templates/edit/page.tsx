import React, { Suspense } from "react";
import { Metadata } from "next";
import EditTemplatePage from "./EditTemplatePage";

export const metadata: Metadata = {
    title: "Edit Template | Athletix",
};

export default function Page() {
    return (
        <Suspense>
            <EditTemplatePage />;
        </Suspense>
    );
}
