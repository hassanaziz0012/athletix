"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import TemplatesCardLayout from "./TemplatesCardLayout";
import TemplatesTableLayout from "./TemplatesTableLayout";
import { APITemplate } from "@/app/apiTypes";
import Layouts from "@/app/dataLayouts";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import Container from "@/app/components/Container";
import icons from "@/app/icons";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import SearchBar from "@/app/components/forms/SearchBar";
import AnimatedLoader from "@/app/components/AnimatedLoader";

export default function Templates() {
    const [templates, setTemplates] = useState<APITemplate[]>();
    const [filtered, setFiltered] = useState<APITemplate[]>();
    const [layout, setLayout] = useState<Layouts>(Layouts.TABLE);
    const [search, setSearch] = useState("");

    const getTemplates = () => {
        sendRequest(
            "/workouts/templates",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setTemplates(data);
                setFiltered(data);
            },
            async (response: Response) => {
                console.error("Error fetching templates:", response);
            }
        );
    };

    const searchTemplates = () => {
        if (search.length > 3) {
            setFiltered(
                templates?.filter((template) =>
                    template.workout.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
            );
        } else {
            setFiltered(templates);
        }
    };

    useEffect(() => {
        getTemplates();
    }, []);

    useEffect(() => {
        searchTemplates();
    }, [search]);

    const AddTemplateBtn = () => (
        <Link href={"/app/templates/add"}>
            <PrimaryButton
                onClick={() => {}}
                className="flex items-center gap-x-2"
            >
                {icons.add}
                New Template
            </PrimaryButton>
        </Link>
    );

    return (
        <Container>
            <div className="flex items-center justify-between flex-wrap gap-8 mb-12">
                <h1 className="text-4xl font-semibold grow">Templates</h1>
                <div>
                    <div className="flex gap-x-2 items-center flex-wrap border rounded p-2">
                        <button
                            onClick={() => setLayout(Layouts.TABLE)}
                            className={`${
                                layout === Layouts.TABLE ? "active" : ""
                            } [&.active]:bg-sky-500 [&.active]:text-white p-1 rounded`}
                        >
                            {icons.tableLayout}
                        </button>
                        <button
                            onClick={() => setLayout(Layouts.CARD)}
                            className={`${
                                layout === Layouts.CARD ? "active" : ""
                            } [&.active]:bg-sky-500 [&.active]:text-white p-1 rounded`}
                        >
                            {icons.cardLayout}
                        </button>
                    </div>
                </div>
                <AddTemplateBtn />
            </div>

            <div className="mb-12 bg-white">
                <SearchBar state={[search, setSearch]} />
            </div>

            <AnimatedLoader show={templates !== undefined}>
                {templates?.length === 0 && (
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-full max-w-screen-xs">
                            <img
                                src="/images/empty-state.svg"
                                alt="No templates"
                            />
                        </div>
                        <p className="mb-6 text-xl text-center">
                            No templates yet? Add your first template now
                        </p>
                        <AddTemplateBtn />
                    </div>
                )}

                {templates && templates.length > 0 && (
                    <>
                        {layout === Layouts.TABLE && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.5 },
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    transition: { duration: 0.5 },
                                }}
                            >
                                <TemplatesTableLayout
                                    templates={filtered as APITemplate[]}
                                />
                            </motion.div>
                        )}
                        {layout === Layouts.CARD && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: { duration: 0.5 },
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    transition: { duration: 0.5 },
                                }}
                            >
                                <TemplatesCardLayout templates={filtered} />
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatedLoader>
        </Container>
    );
}
