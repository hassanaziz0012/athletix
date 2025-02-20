import React from "react";
import AddWorkoutBtns from "./AddWorkoutBtns";

export default function WorkoutsEmptyState() {
    const emptyStateImg = "/images/empty-state.svg";

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-screen-xs">
                <img src={emptyStateImg} alt="No workouts" />
            </div>
            <p className="mb-6 text-xl text-center">
                No workouts yet? Start your first workout now
            </p>
            <AddWorkoutBtns />
        </div>
    );
}
