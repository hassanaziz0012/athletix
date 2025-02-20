"use client";
import React, { useEffect } from "react";
import Measurement from "./Measurement";
import Container from "@/app/components/Container";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";
import useJoyride from "@/app/hooks/useJoyride";

export default function Measurements() {
    const weightUnit = useDefaultWeightUnit();

    const steps = [
        {
            target: ".measurements",
            content:
                "Measure and track your key metrics here. Weight, Calories, BMI, and muscle sizes.",
            placement: "auto",
        },
    ];
    const [Joyride, startJoyride] = useJoyride("measurements", steps);

    useEffect(() => {
        startJoyride();
    }, []);

    return (
        <Container>
            <Joyride />
            <h2 className="mb-4 uppercase text-slate-600 font-semibold">
                Core Measurements
            </h2>
            <div className="flex flex-col gap-y-10 measurements">
                <Measurement
                    heading="Weight"
                    label="weight"
                    unit={weightUnit}
                    showTutorial={true}
                />
                <Measurement heading="Calories" label="calories" unit="kcal" />
                <Measurement heading="Body Fat %" label="body_fat" unit="%" />
            </div>

            <h2 className="mt-20 mb-4 uppercase text-slate-600 font-semibold">
                Body Parts
            </h2>
            <div className="flex flex-col gap-y-10">
                <Measurement heading="Neck" label="neck" unit="cm" />
                <Measurement heading="Shoulders" label="shoulders" unit="cm" />
                <Measurement heading="Chest" label="chest" unit="cm" />
                <Measurement heading="Waist" label="waist" unit="cm" />
                <Measurement heading="Hips" label="hips" unit="cm" />
                <Measurement
                    heading="Left Bicep"
                    label="left_bicep"
                    unit="cm"
                />
                <Measurement
                    heading="Right Bicep"
                    label="right_bicep"
                    unit="cm"
                />
                <Measurement
                    heading="Left Forearm"
                    label="left_forearm"
                    unit="cm"
                />
                <Measurement
                    heading="Right Forearm"
                    label="right_forearm"
                    unit="cm"
                />
                <Measurement heading="Upper Abs" label="upper_abs" unit="cm" />
                <Measurement heading="Lower Abs" label="lower_abs" unit="cm" />
                <Measurement
                    heading="Left Thigh"
                    label="left_thigh"
                    unit="cm"
                />
                <Measurement
                    heading="Right Thigh"
                    label="right_thigh"
                    unit="cm"
                />
                <Measurement heading="Left Calf" label="left_calf" unit="cm" />
                <Measurement
                    heading="Right Calf"
                    label="right_calf"
                    unit="cm"
                />
            </div>
        </Container>
    );
}
