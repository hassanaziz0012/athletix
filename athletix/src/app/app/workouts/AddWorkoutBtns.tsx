import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import Link from "next/link";
import React from "react";
import AddFromTemplate from "./AddFromTemplate";

export default function AddWorkoutBtns() {
    return (
        <div className="flex flex-wrap gap-2">
            <Link href={"/app/workouts/add"}>
                <PrimaryButton onClick={() => {}}>Add Workout</PrimaryButton>
            </Link>

            <AddFromTemplate />
        </div>
    );
}
