import React, { Suspense } from "react";
import { Metadata } from "next";
import EditWorkoutPage from "./EditWorkoutPage";

export const metadata: Metadata = {
    title: "Edit Workout | Athletix",
};

export default function Page() {
    return (
        <Suspense>
            <EditWorkoutPage />
        </Suspense>
    );
}
