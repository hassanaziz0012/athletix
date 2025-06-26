"use client";
import { displayWeightValue } from "@/app/apiUtils";
import useDefaultWeightUnit from "@/app/hooks/useDefaultWeightUnit";
import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type DataItem = { date: string; record: number };

interface ExerciseMaxRecordGraphProps {
    records: DataItem[];
}

export default function ExerciseMaxRecordGraph({
    records,
}: ExerciseMaxRecordGraphProps) {
    const data = records;

    const defaultUnit = useDefaultWeightUnit();

    const CustomTooltip = ({ active, payload, label }: {
        active?: boolean;
        payload?: { value: number }[];
        label?: string;
    }) => {
        if (active === true) {
            const value: number | undefined = payload && payload[0].value;
            return (
                <div className="p-5 border bg-white">
                    <div>{label}</div>
                    <div className="text-emerald-500">
                        Best Estimated 1RM:{" "}
                        <span className="font-semibold">
                            {displayWeightValue(value || 0)} {defaultUnit}
                        </span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="border rounded-xl p-5">
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="record" stroke="#8884d8" />
            </LineChart>
        </div>
    );
}
