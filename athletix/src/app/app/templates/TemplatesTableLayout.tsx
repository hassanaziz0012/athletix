import React from "react";
import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    Cell,
    HeaderCell,
} from "@table-library/react-table-library/table";
import {
    useSort,
    HeaderCellSort,
} from "@table-library/react-table-library/sort";
import Link from "next/link";
import { APITemplate } from "@/app/apiTypes";
import icons from "@/app/icons";
import { displayWeightValue } from "@/app/apiUtils";

export default function TemplatesTableLayout({
    templates,
}: {
    templates: APITemplate[];
}) {
    const data = { nodes: templates };

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
                {(templates: APITemplate[]) => (
                    <>
                        <Header>
                            <HeaderRow className="!bg-slate-700">
                                <HeaderCellSort
                                    sortKey="NAME"
                                    className="!p-4 !border-0 text-slate-300 !font-semibold !mb-6 !rounded-s-xl"
                                >
                                    Name
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="DATE"
                                    className="!p-4 !border-0 text-slate-300 !font-semibold !mb-6"
                                >
                                    Schedule
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="VOLUME"
                                    className="!p-4 !border-0 text-slate-300 !font-semibold !mb-6"
                                >
                                    Volume
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="PRS"
                                    className="!p-4 !border-0 text-slate-300 !font-semibold !mb-6"
                                >
                                    PRs
                                </HeaderCellSort>
                                <HeaderCell className="!p-4 !border-0 text-slate-300 !font-semibold !mb-6 !rounded-e-xl">
                                    Actions
                                </HeaderCell>
                            </HeaderRow>
                        </Header>

                        <Body>
                            {templates.map((template) => (
                                <Row key={template.id} item={template}>
                                    <Cell className="!p-4">
                                        <Link
                                            className="text-sky-500 hover:underline"
                                            href={`/app/templates/details?id=${template.id}`}
                                        >
                                            {template.workout.name}
                                        </Link>
                                    </Cell>
                                    <Cell className="!p-4">
                                        {/* <div>Next workout on {" Tuesday "}</div> */}
                                        <div className="text-slate-500 text-wrap">
                                            Repeats{" "}
                                            <span className="font-semibold">
                                                {template.schedule}
                                            </span>{" "}
                                            {template.schedule !== "daily" && (
                                                <>
                                                    on every{" "}
                                                    <span className="font-semibold">
                                                        {template.days.join(
                                                            ", "
                                                        )}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </Cell>
                                    <Cell className="!p-4">
                                        {displayWeightValue(template.workout.volume.value)}{" "}
                                        {template.workout.volume.unit}
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div className="flex items-center gap-x-1">
                                            {template.workout.prs} PRs{" "}
                                            {icons.trophySmall}
                                        </div>
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div className="flex">
                                            <Link
                                                href={`/app/workouts/add?template=${template.id}`}
                                            >
                                                <button className="p-2 rounded bg-sky-200 text-sky-600">
                                                    {icons.copy}
                                                </button>
                                            </Link>
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
