import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import Link from "next/link";
import React, { useEffect } from "react";
import AddFromTemplate from "../workouts/AddFromTemplate";
import { APIProfile } from "@/app/apiTypes";
import { motion } from "motion/react";
import useJoyride from "@/app/hooks/useJoyride";

export default function WelcomeBanner({ profile }: { profile: APIProfile }) {
    const steps = [
        {
            target: ".blank-workout",
            content: "Create a blank workout to get started.",
        },
        {
            target: ".from-template",
            content:
                "Add a workout from a template. Templates are simply workouts that you can repeat regularly.",
        },
    ];
    const [Joyride, startJoyride] = useJoyride("welcome-banner", steps);

    useEffect(() => {
        if (profile) {
            setTimeout(() => startJoyride(), 500);
        }
    }, [profile]);

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
            className="border rounded-xl p-5 bg-slate-700 border-slate-700 text-white flex flex-wrap gap-6 items-center justify-between"
        >
            <div>
                <h1 className="text-4xl font-semibold mb-4">
                    Hey, {profile.firstName}!
                </h1>
                <p className="text-slate-300">
                    Welcome to your fitness dashboard!
                </p>
            </div>

            <Joyride />

            <div className="flex flex-wrap items-center gap-2">
                <Link href={"/app/workouts/add"} className="blank-workout">
                    <PrimaryButton onClick={() => {}}>
                        Blank Workout
                    </PrimaryButton>
                </Link>
                <div className="from-template">
                    <AddFromTemplate btnText="From Template" />
                </div>
            </div>
        </motion.div>
    );
}
