"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { APITemplate } from "@/app/apiTypes";
import { RequestMethod, sendRequest } from "@/app/apiUtils";
import LightButton from "@/app/components/buttons/LightButton";
import Modal from "@/app/components/Modal";
import { animatedIcons } from "@/app/icons";

interface AddFromTemplateProps {
    btnText?: string;
}

export default function AddFromTemplate({ btnText }: AddFromTemplateProps) {
    const [templates, setTemplates] = useState<APITemplate[]>();
    const [selectTemplateModalState, setSelectTemplateModalState] =
        useState(false);

    const getTemplates = () => {
        sendRequest(
            "/workouts/templates",
            RequestMethod.GET,
            null,
            async (response: Response) => {
                const data = await response.json();
                console.log(data);
                setTemplates(data);
            },
            async (response: Response) => {
                console.error("Error fetching templates:", response);
            }
        );
    };

    return (
        <div>
            <LightButton
                onClick={() => {
                    setSelectTemplateModalState(true);
                    getTemplates();
                }}
            >
                {btnText || "Add from template"}
            </LightButton>
            <Modal
                modalState={[
                    selectTemplateModalState,
                    setSelectTemplateModalState,
                ]}
            >
                <div className="p-5 rounded bg-white text-black">
                    <h2 className="text-xl">Select a template</h2>

                    <div className="my-8">
                        <AnimatePresence>
                            {templates ? (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.95,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.95,
                                    }}
                                >
                                    {templates.map((template, i) => (
                                        <Link
                                            key={i}
                                            href={`/app/workouts/add?template=${template.id}`}
                                        >
                                            <div className="p-5 hover:scale-105 rounded duration-300 hover:bg-slate-50 hover:shadow">
                                                <div>
                                                    {template.workout.name}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {templates.length === 0 && (
                                        <div>
                                            <p className="text-slate-600">Please create a template first.</p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="w-8 h-8">
                                    {animatedIcons.spinner}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="border-t py-4 flex justify-end">
                        <button
                            className="text-slate-600"
                            onClick={() => setSelectTemplateModalState(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
