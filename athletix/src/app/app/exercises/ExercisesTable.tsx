"use client";
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
import { useTheme } from "@table-library/react-table-library/theme";
import {
    useSort,
    HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import Tooltip from "./Tooltip";
import DeleteExerciseConfirmAction from "./DeleteExerciseConfirmAction";
import EditExerciseAction from "./EditExerciseAction";
import ViewExerciseAction from "./ViewExerciseAction";
import { bodyPartIcons, Exercise } from "@/app/apiTypes";
import icons from "@/app/icons";
import { PageInfo } from "./Exercises";
import { displayWeightValue } from "@/app/apiUtils";

export type ExerciseItem = Exercise & {
    onDelete: (id: number) => void;
};

interface ExercisesTableProps {
    exercises: ExerciseItem[];
    pageInfo: PageInfo;
    refreshExercises: () => void;
    openPage: (page: number) => void;
}

export default function ExercisesTable({
    exercises,
    pageInfo,
    refreshExercises,
    openPage,
}: ExercisesTableProps) {
    const data = { pageInfo, nodes: exercises };

    const theme = useTheme({
        HeaderCell: `
            overflow: visible !important;

            div {
                overflow: visible !important;
            }
        `,
    });

    const sort = useSort(
        data,
        {},
        {
            sortFns: {
                NAME: (exercises) =>
                    exercises.sort((a, b) => {
                        console.log(a, b);
                        return a.name.localeCompare(b.name);
                    }),
                BODY_PART: (exercises) =>
                    exercises.sort((a, b) =>
                        a.body_part.localeCompare(b.body_part)
                    ),
                ESTIMATED_1RM: (exercises) =>
                    exercises.sort(
                        (a, b) =>
                            (a.stats?.estimated_1rm ?? -1) -
                            (b.stats?.estimated_1rm ?? -1)
                    ),
                MAX_VOLUME: (exercises) =>
                    exercises.sort(
                        (a, b) =>
                            (a.stats?.max_vol ?? -1) - (b.stats?.max_vol ?? -1)
                    ),
                MAX_WEIGHT: (exercises) =>
                    exercises.sort(
                        (a, b) =>
                            (a.stats?.max_weight ?? -1) -
                            (b.stats?.max_weight ?? -1)
                    ),
            },
            sortIcon: {
                margin: "0px",
                iconDefault: icons.sortDefault,
                iconUp: icons.sortAscending,
                iconDown: icons.sortDescending,
            },
        }
    );

    const resize = { resizerHighlight: "#e2e8f0" }; // bg-slate-200

    const pagination = usePagination(
        data,
        {
            state: {
                page: 0,
                size: 10,
            },
        },
        {
            isServer: false,
        }
    );

    return (
        <>
            <Table
                data={data}
                sort={sort}
                theme={theme}
                pagination={pagination}
            >
                {(exercises: ExerciseItem[]) => (
                    <>
                        <Header>
                            <HeaderRow className="!bg-slate-700">
                                <HeaderCellSort
                                    sortKey="NAME"
                                    resize={{ ...resize, minWidth: 200 }}
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold !rounded-s-xl"
                                >
                                    Name
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="BODY_PART"
                                    resize={resize}
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold"
                                >
                                    Body Part
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="ESTIMATED_1RM"
                                    resize={resize}
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold"
                                >
                                    <div className="flex gap-x-2">
                                        <span>Estimated 1RM</span>
                                        <Tooltip>
                                            <p className="font-normal text-sm">
                                                Your estimated 1 rep max for
                                                this exercise.
                                            </p>
                                        </Tooltip>
                                    </div>
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="MAX_VOLUME"
                                    resize={resize}
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold"
                                >
                                    <div className="flex gap-x-2">
                                        <span>Max Volume</span>
                                        <Tooltip>
                                            <p className="font-normal text-sm">
                                                The maximum volume (reps *
                                                weight) in a single set
                                                you&apos;ve performed for this
                                                exercise.
                                            </p>
                                        </Tooltip>
                                    </div>
                                </HeaderCellSort>
                                <HeaderCellSort
                                    sortKey="MAX_WEIGHT"
                                    resize={resize}
                                    className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold"
                                >
                                    <div className="flex gap-x-2">
                                        Max Weight
                                        <Tooltip>
                                            <p className="font-normal text-sm">
                                                The maximum weight you&apos;ve
                                                lifted for this exercise.
                                            </p>
                                        </Tooltip>
                                    </div>
                                </HeaderCellSort>
                                <HeaderCell className="!p-4 !border-0 !mb-6 text-slate-300 !font-semibold !rounded-e-xl">
                                    Actions
                                </HeaderCell>
                            </HeaderRow>
                        </Header>

                        <Body>
                            {exercises.map((exercise) => (
                                <Row key={exercise.id} item={exercise}>
                                    <Cell className="!p-4">
                                        {exercise.name}
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div className="flex flex-col items-center">
                                            {bodyPartIcons[
                                                exercise.body_part
                                            ] && (
                                                <img
                                                    src={
                                                        bodyPartIcons[
                                                            exercise.body_part
                                                        ]
                                                    }
                                                    alt=""
                                                    className="w-12 h-12"
                                                />
                                            )}
                                            <div className="capitalize">
                                                {exercise.body_part}
                                            </div>
                                        </div>
                                    </Cell>
                                    <Cell className="!p-4">
                                        {exercise.stats?.estimated_1rm &&
                                            displayWeightValue(
                                                exercise.stats.estimated_1rm
                                                    .value
                                            ) +
                                                " " +
                                                exercise.stats.estimated_1rm
                                                    .unit}
                                    </Cell>
                                    <Cell className="!p-4">
                                        {exercise.stats?.max_vol &&
                                            displayWeightValue(
                                                exercise.stats.max_vol.value
                                            ) +
                                                " " +
                                                exercise.stats.max_vol.unit}
                                    </Cell>
                                    <Cell className="!p-4">
                                        {exercise.stats?.max_weight &&
                                            displayWeightValue(
                                                exercise.stats.max_weight.value
                                            ) +
                                                " " +
                                                exercise.stats.max_weight.unit}
                                    </Cell>
                                    <Cell className="!p-4">
                                        <div className="flex items-center gap-x-4">
                                            <ViewExerciseAction
                                                exercise={exercise}
                                            />

                                            {exercise.is_custom && (
                                                <>
                                                    <EditExerciseAction
                                                        exercise={exercise}
                                                        refreshExercises={
                                                            refreshExercises
                                                        }
                                                    />
                                                    <DeleteExerciseConfirmAction
                                                        exercise={exercise}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </Cell>
                                </Row>
                            ))}
                        </Body>
                    </>
                )}
            </Table>

            {data.pageInfo && (
                <div className="my-6 flex flex-wrap gap-3">
                    {[...Array(data.pageInfo.pages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => openPage(index + 1)}
                            className={`${
                                index + 1 === data.pageInfo.current && "active"
                            } w-8 h-8 p-2 flex items-center justify-center rounded-md border border-sky-600 text-sky-600 hover:bg-sky-200 duration-300 [&.active]:bg-sky-600 [&.active]:text-white`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
