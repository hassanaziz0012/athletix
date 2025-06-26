"use client";
import React, { useEffect, useState } from "react";
import Container, { ContainerSizes } from "./Container";
import { AnimatePresence, motion } from "motion/react";
import BorderedImage from "./BorderedImage";

export default function Features() {
    const tabs = [
        { id: "track-workouts", label: "Track your workouts" },
        { id: "measure", label: "Measure everything in your body" },
        { id: "create-split", label: "Create your workout split" },
        { id: "track-goals", label: "Track your fitness goals" },
        { id: "self-hosted", label: "Completely offline and self-hosted" },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    useEffect(() => {
        const interval = setInterval(() => {
            const index = tabs.findIndex((tab) => tab.id === activeTab);
            setActiveTab(tabs[(index + 1) % tabs.length].id);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeTab]);

    return (
        <section className="py-20">
            <Container size={ContainerSizes.extralarge}>
                <h2 className="text-2xl mb-12">Features</h2>

                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-12">
                    <div className="flex flex-col gap-y-2 items-center sm:items-start">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    tab.id === activeTab && "active"
                                } text-lg px-6 py-3 rounded-xl [&.active]:shadow-xl [&.active]:scale-105 [&.active]:bg-white duration-300`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="py-3">
                        <AnimatePresence mode="wait">
                            {activeTab === "track-workouts" && (
                                <motion.div
                                    initial={{ opacity: 0, translateY: 50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 50 }}
                                    key={"track-workouts"}
                                >
                                    <div className="max-w-screen-sm">
                                        <BorderedImage imgSrc="/images/athletix-workout-details.png" />
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "measure" && (
                                <motion.div
                                    initial={{ opacity: 0, translateY: 50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 50 }}
                                    key={"measure"}
                                >
                                    <div className="max-w-screen-sm">
                                        <BorderedImage imgSrc="/images/athletix-measurements.png" />
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "create-split" && (
                                <motion.div
                                    initial={{ opacity: 0, translateY: 50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 50 }}
                                    key={"create-split"}
                                >
                                    <div className="max-w-screen-sm">
                                        <BorderedImage imgSrc="/images/athletix-upcoming.png" />
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "track-goals" && (
                                <motion.div
                                    initial={{ opacity: 0, translateY: 50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 50 }}
                                    key={"track-goals"}
                                >
                                    <div className="max-w-screen-sm">
                                        <BorderedImage imgSrc="/images/athletix-fitness-goals.png" />
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "self-hosted" && (
                                <motion.div
                                    initial={{ opacity: 0, translateY: 50 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 50 }}
                                    key={"self-hosted"}
                                >
                                    <div className="max-w-screen-sm">
                                        <BorderedImage imgSrc="/images/athletix-self-hosted.png" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Container>
        </section>
    );
}
