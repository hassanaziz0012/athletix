import Container from "@/app/components/Container";
import React, { Suspense } from "react";
import AddWorkoutForm from "./AddWorkoutForm";
import { Metadata } from "next";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export const metadata: Metadata = {
    title: "New Workout | Athletix",
};

export default function Page() {
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Workouts", link: "/app/workouts" },
        { name: "New Workout", link: "/app/workouts/add" },
    ];

    return (
        <Suspense>
            <section>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Container>
                    <div className="mt-12">
                        <AddWorkoutForm />
                    </div>
                </Container>
            </section>
        </Suspense>
    );
}
