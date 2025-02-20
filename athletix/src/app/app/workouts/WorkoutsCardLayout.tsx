import React from "react";
import Link from "next/link";
import Workout from "./Workout";
import { APIWorkout } from "@/app/apiTypes";

interface WorkoutsCardLayoutProps {
    workouts: APIWorkout[];
}

export default function WorkoutsCardLayout({
    workouts,
}: WorkoutsCardLayoutProps) {
    return (
        <div className="flex gap-6 flex-wrap">
            {workouts.map((workout, i) => (
                <div key={i} className="grow basis-0 min-w-80">
                    <Link href={`/app/workouts/details?id=${workout.id}`}>
                        <Workout
                            id={workout.id}
                            name={workout.name}
                            volume={workout.volume}
                            prs={workout.prs}
                            performed_date={workout.performed_date}
                            exercises={workout.exercises}
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
}
