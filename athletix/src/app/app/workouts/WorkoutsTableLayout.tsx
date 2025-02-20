"use client";
import React from "react";
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    Cell,
} from "@table-library/react-table-library/table";
import {
    useSort,
    HeaderCellSort,
} from "@table-library/react-table-library/sort";
import Link from "next/link";
import { APIWorkout } from "@/app/apiTypes";
import icons from "@/app/icons";
import LastSeen from "@/app/components/LastSeen";
import { displayWeightValue } from "@/app/apiUtils";

interface WorkoutsTableLayoutProps {
    workouts: APIWorkout[];
}

export default function WorkoutsTableLayout({
    workouts,
}: WorkoutsTableLayoutProps) {
    const data = { nodes: workouts };

    const sort = useSort(
        data,
        {},
        {
            sortFns: {
                NAME: (workouts) =>
                    workouts.sort((a, b) => a.name.localeCompare(b.name)),
                DATE: (workouts) =>
                    workouts.sort(
                        (a, b) =>
                            new Date(b.performed_date).valueOf() -
                            new Date(a.performed_date).valueOf()
                    ),
                VOLUME: (workouts) =>
                    workouts.sort((a, b) => b.volume - a.volume),
                PRS: (workouts) => workouts.sort((a, b) => b.prs - a.prs),
            },
            sortIcon: {
                margin: "0px",
                iconDefault: icons.sortDefault,
                iconUp: icons.sortAscending,
                iconDown: icons.sortDescending,
            },
        }
    );

    return (
        <>
            <Table data={data} sort={sort}>
                {(workouts: APIWorkout[]) => (
                    <>
                        <Header>
                            <HeaderRow className="!bg-slate-700">
                                <HeaderCellSort
                                    sortKey="NAME"
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold !rounded-s-xl"
                                >
                                    Name
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="DATE"
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold "
                                >
                                    Date / Time
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="VOLUME"
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold"
                                >
                                    Volume
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="PRS"
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold !rounded-e-xl"
                                >
                                    PRs
                                </HeaderCellSort>
                            </HeaderRow>
                        </Header>

                        <Body>
                            {workouts.map((workout) => (
                                <Row key={workout.id} item={workout}>
                                    <Cell className="!p-4">
                                        <Link
                                            className="text-sky-500 hover:underline"
                                            href={`/app/workouts/details?id=${workout.id}`}
                                        >
                                            {workout.name}
                                        </Link>
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div>
                                            <LastSeen
                                                date={
                                                    new Date(
                                                        workout.performed_date
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="text-slate-500">
                                            {new Date(
                                                workout.performed_date
                                            ).toLocaleDateString("default", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </Cell>
                                    <Cell className="!p-4">
                                        {displayWeightValue(
                                            workout.volume.value
                                        )}{" "}
                                        {workout.volume.unit}
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div className="flex items-center gap-x-1">
                                            {workout.prs} PRs{" "}
                                            {icons.trophySmall}
                                        </div>
                                    </Cell>
                                </Row>
                            ))}
                        </Body>
                    </>
                )}
            </Table>
        </>
    );
}
