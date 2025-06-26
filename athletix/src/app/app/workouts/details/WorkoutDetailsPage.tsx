"use client";
import Container from "@/app/components/Container";
import { useSearchParams } from "next/navigation";
import React from "react";
import WorkoutDetails from "./WorkoutDetails";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export default function WorkoutDetailsPage() {
    const params = useSearchParams();
    const workoutId = params.get("id");
    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Workouts", link: "/app/workouts" },
        { name: "Details", link: `/app/workouts/details?id=${workoutId}` },
    ];
    return (
        <section className="mt-16">
            <Breadcrumbs breadcrumbs={breadcrumbs} />

            <Container>
                {workoutId ? (
                    <WorkoutDetails id={workoutId} />
                ) : (
                    <div>
                        <p className="text-center text-xl text-red-500">
                            Uh oh, you discovered a broken page.{" "}
                        </p>
                    </div>
                )}
            </Container>
        </section>
    );
}
