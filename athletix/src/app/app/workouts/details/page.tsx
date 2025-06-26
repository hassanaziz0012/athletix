import React, { Suspense } from "react";
import { Metadata } from "next";
import WorkoutDetailsPage from "./WorkoutDetailsPage";

export const metadata: Metadata = {
    title: "Workout Details | Athletix",
};

export default function Page() {
    return (
        <Suspense>
            <WorkoutDetailsPage />
        </Suspense>
    );
}
