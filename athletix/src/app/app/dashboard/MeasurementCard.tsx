import { APIMeasurement } from "@/app/apiTypes";
import LastSeen from "@/app/components/LastSeen";
import icons from "@/app/icons";
import React from "react";

export default function MeasurementCard({
    label,
    records,
}: APIMeasurement) {
    const latestRecord = records && records[0];
    const nextLatestRecord = records && records[1];

    const getLatestRecords = () => {
        // return 3 latest records
        return records?.slice(0, 3);
    };

    const getChange = () => {
        if (latestRecord && nextLatestRecord) {
            const change =
                ((latestRecord.value.value - nextLatestRecord.value.value) /
                    nextLatestRecord.value.value) *
                100;
            console.log(latestRecord.value, nextLatestRecord.value);
            return Number.parseFloat(change.toFixed(2));
        }
    };

    const change = getChange() || 0;

    return (
        <div className="grow basis-0 min-w-60 p-5 rounded-xl bg-white shadow">
            <div className="">
                <p>{label}</p>
                <div className="my-4 flex items-center gap-x-2">
                    <p className="text-2xl font-semibold">
                        {latestRecord?.value.value} {latestRecord?.value.unit}
                    </p>
                    <span
                        className={`flex items-center ${
                            change > 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {change}% {change > 0 && icons.increase}{" "}
                        {change < 0 && icons.decrease}
                    </span>
                </div>
            </div>

            {/* <div className="mt-6">
                {records && <MeasurementGraph records={records} />}
            </div> */}

            <div className="mt-6">
                {getLatestRecords()?.map((record, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-2 text-slate-600"
                    >
                        <div>
                            <LastSeen date={new Date(record.date)} />
                        </div>
                        <p>
                            {record.value.value} {record.value.unit}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
