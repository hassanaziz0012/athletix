import React from "react";
import Link from "next/link";
import Workout from "../workouts/Workout";
import { APITemplate } from "@/app/apiTypes";

export default function TemplatesCardLayout({
    templates,
}: {
    templates?: APITemplate[];
}) {
    return (
        <div className="flex gap-8 flex-wrap">
            {templates &&
                templates.map((template, i) => (
                    <Link key={i} href={`/templates/details?id=${template.id}`}>
                        <Workout
                            id={template.workout.id}
                            name={template.workout.name}
                            volume={template.workout.volume}
                            creation_date={template.workout.creation_date}
                            exercises={template.workout.exercises}
                            note={template.workout.note}
                            templateDays={template.days}
                            templateSchedule={template.schedule}
                        />
                    </Link>
                ))}
        </div>
    );
}
