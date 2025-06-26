"use client";
import React, { useEffect, useState } from "react";
import ExercisesTable from "./ExercisesTable";
import AddExerciseModalForm from "./AddExerciseModalForm";
import { BodyPart, Exercise } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import Modal from "@/app/components/Modal";
import icons from "@/app/icons";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import Container, { ContainerSizes } from "@/app/components/Container";
import SearchBar from "@/app/components/forms/SearchBar";
import AnimatedLoader from "@/app/components/AnimatedLoader";

export type PageInfo = {
    count: number;
    current: number;
    pages: number;
    next?: string;
    previous?: string;
};

type PaginatedResponse = PageInfo & {
    results: Exercise[];
};

export default function Exercises() {
    const filters = [
        BodyPart.Core,
        BodyPart.Arms,
        BodyPart.Back,
        BodyPart.Chest,
        BodyPart.Legs,
        BodyPart.Shoulders,
        BodyPart.Other,
        BodyPart.Olympic,
        BodyPart.FullBody,
        BodyPart.Cardio,
    ];

    const [pageInfo, setPageInfo] = useState<PageInfo>();
    const [exercises, setExercises] = useState<Exercise[]>();

    const [search, setSearch] = useState("");
    const [activatedFilters, setActivatedFilters] = useState<BodyPart[]>([]);

    const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);

    const getAllExercises = (
        page: number = 1,
        searchTerm: string = "",
        filters: BodyPart[] = []
    ) => {
        sendRequest(
            `/workouts/exercises?page=${page}&search_term=${searchTerm}&filters=${filters.join(
                ","
            )}`,
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data: PaginatedResponse = await response.json();
                console.log(data);
                setPageInfo({
                    count: data.count,
                    current: data.current,
                    pages: data.pages,
                    next: data.next,
                    previous: data.previous,
                });
                setExercises(data.results);
                setExercises(data.results);
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    const openPage = (page: number) =>
        getAllExercises(page, search, activatedFilters);

    const deleteExercise = (id: number) => {
        sendRequest(
            `/workouts/exercises?id=${id}`,
            RequestMethod.DELETE,
            null,
            async (response: Response) => {
                if (response.ok) {
                    getAllExercises();
                }
            },
            async (response: Response) => {
                console.log(response);
            }
        );
    };

    const getTableCells = (exercises: Exercise[]) => {
        return exercises.map((exercise) => {
            return {
                ...exercise,
                onDelete: deleteExercise,
            };
        });
    };

    useEffect(() => {
        getAllExercises();
    }, []);

    useEffect(() => {
        if (search && search.length > 2) {
            getAllExercises(1, search, activatedFilters);
        } else {
            getAllExercises(1, undefined, activatedFilters);
        }
    }, [search, activatedFilters]);

    const addFilter = (filter: BodyPart) => {
        if (activatedFilters.includes(filter)) {
            return;
        }
        setActivatedFilters([...activatedFilters, filter]);
    };

    const removeFilter = (filter: BodyPart) => {
        setActivatedFilters(activatedFilters.filter((f) => f !== filter));
    };

    return (
        <Container size={ContainerSizes.extralarge}>
            <div>
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h1 className="text-2xl">Exercises</h1>
                    <PrimaryButton
                        onClick={() => setAddExerciseModalOpen(true)}
                        className="flex gap-x-2 items-center"
                    >
                        {icons.add}
                        Create New
                    </PrimaryButton>

                    <Modal
                        modalState={[
                            addExerciseModalOpen,
                            setAddExerciseModalOpen,
                        ]}
                    >
                        <AddExerciseModalForm
                            onSubmit={() => getAllExercises()}
                            closeModal={() => setAddExerciseModalOpen(false)}
                        />
                    </Modal>
                </div>

                <div className="my-6 bg-white">
                    <SearchBar state={[search, setSearch]} />
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    {activatedFilters.map((filter, i) => (
                        <button
                            key={i}
                            onClick={() => removeFilter(filter)}
                            className="px-2 py-1 mr-2 border border-sky-400 bg-sky-100 text-sky-600 hover:bg-sky-200 duration-300 rounded-md relative group"
                        >
                            {filter}

                            <div className="absolute top-0 right-0 -mx-4 -my-2 bg-red-200 text-red-500 rounded-full group-hover:bg-red-300 duration-300">
                                {icons.close}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3">
                    {filters.map((filter, i) => (
                        <button
                            key={i}
                            onClick={() => addFilter(filter)}
                            className="px-2 py-1 border border-slate-400 bg-slate-100 hover:bg-slate-200 duration-300 rounded-md"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-10">
                <AnimatedLoader show={exercises !== undefined}>
                    {pageInfo && exercises && (
                        <ExercisesTable
                            pageInfo={pageInfo}
                            exercises={getTableCells(exercises)}
                            refreshExercises={getAllExercises}
                            openPage={openPage}
                        />
                    )}
                </AnimatedLoader>
            </div>
        </Container>
    );
}
