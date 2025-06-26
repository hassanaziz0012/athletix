"use client";
import { APIMeasurementRecord } from "@/app/apiTypes";
import React from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type DataItem = APIMeasurementRecord & {
    dateStr?: string;
    parsedValue?: number;
};

interface MeasurementCardProps {
    records: DataItem[];
}

export default function MeasurementGraph({ records }: MeasurementCardProps) {
    const getGraphData = () => {
        return (
            records.map((m) => {
                m.dateStr = new Date(m.date).toLocaleString("default", {
                    month: "short",
                    day: "2-digit",
                });
                m.parsedValue = m.value.value;

                return m;
            }) || []
        ).reverse();
    };

    const data = getGraphData();

    return (
        <div className="border rounded-xl p-5">
            <ResponsiveContainer width={"100%"} height={300}>
                <LineChart
                    className="w-full h-full"
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="dateStr" />
                    <YAxis dataKey="parsedValue" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="parsedValue"
                        stroke="#82ca9d"
                        strokeWidth={2}
                    />
                    <CartesianGrid strokeDasharray="6 6" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
