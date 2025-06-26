"use client";
import React, { useEffect, useState } from "react";
import MeasurementCard from "./MeasurementCard";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import { APIMeasurement } from "@/app/apiTypes";

export default function FavoriteMeasurementsWidget() {
    const [measurements, setMeasurements] = useState<APIMeasurement[]>([]);

    const getMeasurements = () => {
        sendRequest(
            "/users/measurements/favorites",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setMeasurements(data);
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    useEffect(() => {
        getMeasurements();
    }, []);

    return (
        measurements.length > 0 && (
            <div>
                <div className="flex flex-wrap gap-6">
                    {measurements.map((m, i) => (
                        <MeasurementCard key={i} {...m} />
                    ))}
                </div>
            </div>
        )
    );
}
