"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { APITemplate } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import { motion } from "motion/react";

type UpcomingWorkouts = { [key: string]: APITemplate[] };

export default function UpcomingWidget() {
    const [upcomingWorkouts, setUpcomingWorkouts] =
        useState<UpcomingWorkouts>();

    const displayDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const displayDay = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString("en-US", { weekday: "long" });
    };

    useEffect(() => {
        sendRequest(
            "/workouts/upcoming",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setUpcomingWorkouts(data);
            },
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
            }
        );
    }, []);

    return (
        <div className="rounded-xl p-5 bg-white shadow">
            <h2 className="text-xl mb-12">Upcoming</h2>
            <div className="flex flex-col gap-y-12">
                {upcomingWorkouts && (
                    <>
                        {Object.keys(upcomingWorkouts).length > 0 ? (
                            Object.keys(upcomingWorkouts).map((date, i) => {
                                const templates = upcomingWorkouts[date];

                                if (templates.length === 0) return null;

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-wrap flex-col md:flex-row gap-6 items-stretch"
                                    >
                                        <div className="p-5 rounded-xl bg-gray-100 md:max-w-48 grow">
                                            <div className="text-xl mb-2">
                                                {displayDate(date)}
                                            </div>
                                            <div className="text-gray-600">
                                                {displayDay(date)}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3 grow-[3]">
                                            {templates.map((template, i) => (
                                                <Link
                                                    href={`/app/templates/details?id=${template.id}`}
                                                    key={i}
                                                >
                                                    <div className="px-4 py-2 rounded-md bg-sky-100 hover:bg-sky-200 duration-300 text-sky-800">
                                                        {template.workout.name}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, translateY: 50 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-slate-600"
                            >
                                <p>No upcoming workouts. Enjoy your week. 😊</p>

                                <Link href={"/app/templates"}>
                                    <div className="inline-block text-sky-500 py-3 border-b border-b-transparent hover:border-b-sky-500 mt-6 duration-300">
                                        Add your first routine
                                    </div>
                                </Link>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
