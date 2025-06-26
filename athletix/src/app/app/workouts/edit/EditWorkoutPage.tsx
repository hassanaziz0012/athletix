"use client";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import Container from "@/app/components/Container";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import EditWorkoutForm from "./EditWorkoutForm";

export default function EditWorkoutPage() {
    const searchParams = useSearchParams();
    const workoutId = searchParams.get("id");

    const breadcrumbs = [
        { name: "Dashboard", link: "/app/dashboard" },
        { name: "Workouts", link: "/app/workouts" },
        { name: "Edit Workout", link: `/app/workouts/edit?id=${workoutId}` },
    ];

    return (
        <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <Suspense>
                <section>
                    <Container>
                        <div className="mt-12">
                            {/* <h1 className="text-2xl font-semibold">{workout?.name}</h1> */}
                            {workoutId && (
                                <EditWorkoutForm workoutId={workoutId} />
                            )}
                        </div>
                    </Container>
                </section>
            </Suspense>
        </div>
    );
}
