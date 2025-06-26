"use client";
import React, { useEffect, useState } from "react";
import HistoryWidget from "./HistoryWidget";
import UpcomingWidget from "./UpcomingWidget";
import FavoriteMeasurementsWidget from "./FavoriteMeasurementsWidget";
import { getProfile } from "@/app/apiUtils";
import { APIProfile } from "@/app/apiTypes";
import Container, { ContainerSizes } from "@/app/components/Container";
import WelcomeBanner from "./WelcomeBanner";
import useJoyride from "@/app/hooks/useJoyride";

export default function Dashboard() {
    const [profile, setProfile] = useState<APIProfile>();

    const steps = [
        {
            target: ".welcome-banner",
            content: "Welcome to Athletix! This is your dashboard.",
        },
        {
            target: ".upcoming-widget",
            content:
                "View your upcoming workouts here. When any workout templates repeat, they'll show up here. You'll see a full overview of your training split.",
        },
        {
            target: ".history-widget",
            content:
                "View your past workouts here. Track performance and improvements across workouts.",
        },
    ];

    const [Joyride, startJoyride] = useJoyride("dashboard", steps);

    useEffect(() => {
        getProfile(setProfile);
    }, []);

    useEffect(() => {
        if (profile) {
            startJoyride();
        }
    }, [profile]);

    return (
        <Container size={ContainerSizes.extralarge}>
            <div className="my-12 flex flex-col gap-6">
                {profile && (
                    <div className="welcome-banner">
                        <WelcomeBanner profile={profile} />
                    </div>
                )}

                <Joyride />

                <FavoriteMeasurementsWidget />
                <div className="upcoming-widget">
                    <UpcomingWidget />
                </div>
                <div className="history-widget">
                    <HistoryWidget />
                </div>
            </div>
        </Container>
    );
}
